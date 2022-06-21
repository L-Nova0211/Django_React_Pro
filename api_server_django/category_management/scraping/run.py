from time import time
import os

import random
import sys
import threading
import time
import datetime
import requests
import pickle
from selenium import webdriver
from selenium.common.exceptions import TimeoutException, NoSuchElementException, ElementNotInteractableException, StaleElementReferenceException
import selenium.webdriver.chrome.options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

from PyQt5 import QtCore

import mysql.connector
from mysql.connector import Error
import ctypes
import re
from PyQt5 import QtCore

class ExceptionError(Exception):
    """Base class for exceptions in this module."""
    pass

class InputError(ExceptionError):
    """Exception raised for errors in the input.

    Attributes:
        expression -- input expression in which the error occurred
        message -- explanation of the error
    """

    # def __init__(self):
        # self.expression = expression
        # self.message = message

connection = mysql.connector.connect(host='localhost',
                                                user='root',
                                                password='', use_pure=True)



class scrapeThreadController (QtCore.QObject):
    # sig_send_state = QtCore.pyqtSignal(str)
    # sig_send_detail = QtCore.pyqtSignal(str)
    # sig_send_progress = QtCore.pyqtSignal(int)
    sig_stop_thread_signal = QtCore.pyqtSignal(str)
    def __init__(self, sql_connection):
        QtCore.QObject.__init__(self)
        self.baseUrl = 'https://www.amazon.co.jp/'

        self.sql_connection = sql_connection
        self.sql_cursor = self.sql_connection.cursor()
        query = "USE " + "djangodb"
        self.sql_cursor.execute(query)

        self.proposerList = []
        self.threadsList = []
        self.profileList = range(1, 10)
        self.sig_stop_thread_signal.connect(self.slot_removeThread())

    def addProposer(self, memberId):
        self.proposerList.append(memberId)
        if len(self.proposerList) == 0 or len(self.threadList) > 3:
            return
        for i in range(0, 3-len(self.threadList)):
            profile_index = self.profileList.pop()
            scrape_thread = threading.Thread(target=self.run, name=str(profile_index), args=(self.proposerList[0], str(profile_index), self.sql_connection, self.sql_cursor))
            self.proposerList.remove(self.proposerList[0])

            scrape_thread.start()
            self.threadsList.append(scrape_thread)

    def slot_removeThread(self, threadName):
        for thread in self.threadsList:
            if thread.name == threadName:
                thread.terminate()
                # self.button_stop_thread.disconnect(self.new_thread)
                self.profileList.append(int(threadName))
                del(thread)
                threadList.remove(thread)
        self.startThread()

    def run(self, memberId, profile_index):
        sql = "SELECT * FROM categories WHERE member_id = " + str(memberId)
        self.sql_cursor.execute(sql)
        categoryList = self.sql_cursor.fetchall()
        print(categoryList)

        chrome_options = selenium.webdriver.chrome.options.Options()
        # chrome_options.add_argument("--headless --no-sandbox --disable-blink-features=AutomationControlled")
        chrome_options.add_argument("--no-sandbox --disable-blink-features=AutomationControlled")
        chrome_options.add_argument("user-data-dir=" + os.path.abspath(os.getcwd()) + "\\category_management\\scraping\\profile" + profile_index)
        chrome_options.add_experimental_option("excludeSwitches", ['enable-automation'])
        chrome_options.page_load_strategy = 'eager'
        driver = webdriver.Chrome(executable_path = os.path.abspath(os.getcwd()) + '\\category_management\\scraping\\chromedriver', options=chrome_options)

        try:
            # driver.get(self.scrapUrl)
            driver.get(categoryList[0][2])
            if os.path.exists(os.path.abspath(os.getcwd()) + "\\category_management\\scraping\\cookies.pkl"):
                cookies = pickle.load(open(os.path.abspath(os.getcwd()) + "\\category_management\\scraping\\cookies.pkl", "rb"))
                for cookie in cookies:
                    driver.add_cookie(cookie)
        except selenium.common.exceptions.WebDriverException:
            # self.sig_send_state.emit("Internet Connect Error!")
            driver.quit()
            self.quit()
        basic_window = driver.current_window_handle
        basic_window = self.login_amazon(driver, "beruseberuse682@gmail.com", "beruse@1414")
        # driver.execute_script("window.open('https://keepa.com/');")
        # driver.switch_to.window(driver.window_handles[1])
        # keepa_window = self.login_keepa(driver, "winnetgum@uma3.be", "123456")
        # driver.switch_to.window(basic_window)

        index_category = 0
        for category in categoryList:
            print(category)
            if not category[3] == 0:
                print("already scraped catgegory")
                continue
            sql = "UPDATE categories SET is_scraped = %s WHERE id = %s"
            val = (2, category[0])
            self.sql_cursor.execute(sql, val)
            self.sql_connection.commit()
            try:
                driver.get(category[2])
            except selenium.common.exceptions.WebDriverException:
                # self.lbl_state.setText("Internet Connect Error!")
                print("Internet Connect Error!")
                driver.quit()
                self.quit()

            # self.sig_send_detail.emit(category[3])
            # self.sig_send_state.emit("Scraping..." + category[1])
            if self.check_page_count(driver):   ######################## check page count ###############
                page_count = 20
            else:
                page_count = 1

            for page in range(1, page_count + 1):
                product_list = driver.find_elements_by_xpath("//div[@data-component-type='s-search-result']")
                len_product_list = len(product_list)
                for product_index in range(len_product_list):
                    # if not self.running_flag.isSet():
                    #     driver.close()
                    #     return
                    product_list = driver.find_elements_by_xpath("//div[@data-component-type='s-search-result']")
                    product_asin = product_list[product_index].get_attribute('data-asin')
                    # product_title = product_list[product_index].find_element_by_xpath(".//a[@class='title-link']").get_attribute('title')


                    product_is_prime = self.get_prime_info(product_list[product_index])             #########       is_prime    #########

                    if not product_is_prime == 1:
                        continue

                    sql = "SELECT id, update_time FROM products WHERE asin = %s"
                    self.sql_cursor.execute(sql, (product_asin, ))
                    myresult = self.sql_cursor.fetchall()

                    if len(myresult) > 0 and datetime.datetime.now() - myresult[0][1] < datetime.timedelta(days = 1):
                        # self.sig_send_progress.emit(
                        #     int(index_category * 100 / len(categoryList) + (page - 1) * 100 / len(
                        #         categoryList) / page_count + (product_index + 1) * 100 / len(
                        #         categoryList) / page_count / len_product_list))
                        product_index += 1
                        continue
                    ######      delete old product      #################################
                    sql = "DELETE FROM products WHERE asin = %s"
                    self.sql_cursor.execute(sql, (product_asin,))
                    self.sql_connection.commit()
                    # sql = "DELETE FROM descriptions WHERE product_asin = %s"
                    # self.sql_cursor.execute(sql, product_id)
                    # self.sql_connection.commit()
                    # sql = "DELETE FROM images WHERE product_id = %s"
                    # self.sql_cursor.execute(sql, product_id)
                    # self.sql_connection.commit()
                    # sql = "DELETE FROM productproposers WHERE product_id = %s"
                    # self.sql_cursor.execute(sql, product_id)
                    # self.sql_connection.commit()
                    # sql = "DELETE FROM productinfo WHERE product_id = %s"
                    # self.sql_cursor.execute(sql, product_id)
                    # self.sql_connection.commit()
                    ######################################################################
                    # self.sig_send_detail.emit(product_asin)

                    self.click_product_element(driver, product_index)                                       ##########  click product   #########
                    driver.switch_to.window(driver.window_handles[1])
                    # product_window = driver.current_window_handle
                    product_title = driver.find_element_by_xpath("//span[@id='productTitle']").text         ##########  title   #######
                    product_description = self.get_description(driver)                                      ##########  description #########

                    ######      insert product     #######################
                    product_url = "https://www.amazon.co.jp/-/jp/dp/" + product_asin
                    sql = "INSERT INTO products (asin, title, url, is_prime) VALUES (%s, %s, %s, %s)"
                    val = (product_asin, product_title, product_url, product_is_prime)
                    self.sql_cursor.execute(sql, val)
                    self.sql_connection.commit()

                    sql = "SELECT id FROM products WHERE asin = %s"
                    self.sql_cursor.execute(sql, (product_asin, ))
                    sql_result = self.sql_cursor.fetchall()
                    product_id = sql_result[0][0]                                       ##############      product_id      #######
                    ####        insert description      ##################
                    val = []
                    for content in product_description:
                        val.append((product_id, content))
                    if len(val) > 0:
                        sql = "INSERT INTO descriptions (product_id, content) VALUES (%s, %s)"
                        self.sql_cursor.executemany(sql, val)
                        self.sql_connection.commit()
                    ########################################################################
                    product_info = self.get_information(driver, product_id,
                                                        product_asin)       ##########      product info   #########
                    ######      insert productinfo        #################################
                    sql = "INSERT INTO productinfo (product_id, seller, price, stocks, shipper, stocks_status) VALUES (%s, %s, %s, %s, %s, %s)"
                    # val = (product_id, product_seller, product_price, product_stocks, product_shipper, stocks_status)
                    self.sql_cursor.executemany(sql, product_info)
                    self.sql_connection.commit()
                    #####       get and insert images       ########################
                    bid_img_pane = driver.find_element_by_xpath("//span[@data-action='main-image-click']")
                    self.scroll_shim(driver, bid_img_pane)
                    # ActionChains(driver).move_to_element(bid_img_pane).pause(random.random()/2).click().perform()
                    bid_img_pane.click()
                    product_images = driver.find_elements_by_xpath("//div[@id='ivThumbs']//div[@class='ivThumbImage'][@style]")
                    for product_image in product_images:
                        try:
                            # ActionChains(driver).move_to_element(product_image).pause(random.random() / 2).click().perform()
                            product_image.click()
                        except ElementNotInteractableException:
                            pass
                        while self.image_loading_check(driver):
                            time.sleep(.1)
                        time.sleep(.2)
                        try:
                            real_product_image_url_tmp = driver.find_element_by_xpath("//div[@id='ivLargeImage']/img").get_attribute("src")
                            sql = "INSERT INTO images (product_id, url) VALUES (%s, %s)"
                            val = (product_id, real_product_image_url_tmp)
                            self.sql_cursor.execute(sql, val)
                            self.sql_connection.commit()
                        except StaleElementReferenceException:
                            pass
                        
                    ######      insert productproposer         #########################
                    sql = "INSERT INTO productproposer (member_id, product_id, category_id) VALUES (%s, %s, %s)"
                    val = (category[5], product_id, category[0])
                    self.sql_cursor.execute(sql, val)
                    self.sql_connection.commit()
                    ######################################

                    # self.sig_send_progress.emit(int(index_category * 100 / len(categoryList) + (page - 1) * 100 / len(
                    #     categoryList) / page_count + (product_index + 1) * 100 / len(
                    #     categoryList) / page_count / len_product_list))
                    driver.close()
                    driver.switch_to.window(basic_window)

                self.click_next_page_num(driver)
                # self.sig_send_progress.emit(int(index_category * 100 / len(categoryList)+ page*100/len(categoryList)/page_count))
            # self.sig_send_progress.emit(int((index_category+1) * 100 / len(categoryList)))
            sql = "UPDATE categories SET is_scraped = %s WHERE id = %s"
            val = (1, category[0])
            self.sql_cursor.execute(sql, val)
            self.sql_connection.commit()

            index_category += 1
        # self.sig_send_progress.emit(100)
        # self.sig_send_detail.emit("Complete!")
        # self.notwait_flag.clear()
        # self.running_flag.clear()
        driver.close()
        # flag.wait()
        # flag.set()
        self.stop_thread_signal.emit(profile_index)
        # flag.clear()


    def quit(self):
        # self.notwait_flag.clear()
        # self.running_flag.clear()
        thread_id = self.get_id()
        res = ctypes.pythonapi.PyThreadState_SetAsyncExc(thread_id,
                                                         ctypes.py_object(SystemExit))
        if res > 1:
            ctypes.pythonapi.PyThreadState_SetAsyncExc(thread_id, 0)
            print('Exception raise failure')

    def get_id(self):
        # returns id of the respective thread
        if hasattr(self, '_thread_id'):
            return self._thread_id
        for id, thread in threading._active.items():
            if thread is self:
                return id

    def captcha_check(self, driver, product_index):
        actions = webdriver.ActionChains(driver)
        while True:
            if self.feedback_check(driver):
                print("It is traffic")
                feedback_button = driver.find_element_by_link_text("feedback")
                actions.reset_actions()
                actions.move_to_element(feedback_button).perform()
                time.sleep(random.random())
                feedback_button.click()
                time.sleep(random.random() * 5 + 5)
                driver.switch_to.window(driver.window_handles[2])
                time.sleep(random.random())
                driver.close()
                driver.switch_to.window(driver.window_handles[1])
                refresh_button = driver.find_element_by_link_text("refresh")
                actions.reset_actions()
                actions.move_to_element(refresh_button).perform()
                time.sleep(random.random())
                refresh_button.click()

            if self.captcha_button_check(driver):
                print("It is captcha")
                captcha_button = driver.find_element_by_id("nc_1_n1z")
                time.sleep(15)
                self.scroll_shim(driver, captcha_button)
                # actions.reset_actions()
                # actions.move_to_element_with_offset(captcha_button,int(captcha_button.size['width']/2),int(captcha_button.size['height']/2))
                # time.sleep(random.random())
                # actions.click_and_hold(captcha_button).perform()
                # # for i in range(1,3):
                # actions.move_by_offset(300, 0).perform()
                #     # time.sleep(.25)
                # actions.release().perform()
                # actions.reset_actions()

                seconds = .5
                print(seconds)
                samples = int(seconds*10)
                diffs = sorted(random.sample(range(0, 300), samples-1))
                diffs.insert(0, 0)
                diffs.append(300)
                ActionChains(driver).click_and_hold(captcha_button).perform()
                for i in range(samples):
                    ActionChains(driver).pause(seconds/samples).move_by_offset(diffs[i+1]-diffs[i], 0).perform()
                ActionChains(driver).release().perform()

            else:
                print("Internet Connection error!")
                # self.sig_send_detail.emit(
                #     "Internet Connection error!\nCheck out Internet Connection!!!")
                driver.quit()
                self.quit()
                return
            time.sleep(5)
            try:
                element = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, "table-sku"))
                )
                return
            except Exception:
                driver.close()
                driver.switch_to.window(driver.window_handles[0])
                driver.execute_script("location.reload()")
            delay = 0
            while delay < 155:
                product_list = driver.find_elements_by_xpath("//li[@class='offer-list-row-offer']")
                count = len(product_list)
                will_move_index = int(count * random.random())
                driver.execute_script("arguments[0].scrollIntoView(true);", product_list[will_move_index])
                driver.execute_script("window.scrollBy(0, -300)")
                product_element = product_list[product_index].find_element_by_xpath(".//div[@class='image']")
                time.sleep(random.random())
                actions.reset_actions()
                actions.move_to_element_with_offset(product_element, 300, 300)
                time.sleep(random.random() / 4 + 0.5)
                ran_interval = random.randrange(1, 5)
                delay += ran_interval
                time.sleep(ran_interval)
            # if not self.running_flag.isSet():
            #     driver.quit()
            #     self.quit()
            #     return
            # self.notwait_flag().wait()
            self.click_product_element(driver, product_index)
            try:
                element = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, "table-sku"))
                )
                return
            except Exception:
                pass

    def feedback_check(self, driver):
        try:
            element = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.LINK_TEXT, "feedback"))
            )
            return True
        except Exception:
            return False

    def captcha_button_check(self, driver):
        try:
            captcha_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "nc_1_n1z"))
            )
            return True
        except Exception:
            # print("Internet Connection error!")
            # self.sig_send_detail.emit(
            #     "Internet Connection error!\nCheck out Internet Connection!!!")
            # driver.quit()
            # self.quit()
            return False

    def click_product_element(self, driver, product_index):
        actions = webdriver.ActionChains(driver)
        # ran_move_count = int(random.uniform(3, 6))
        # for i in range(ran_move_count):
        #     product_list = driver.find_elements_by_xpath("//li[@class='offer-list-row-offer']")
        #     count = len(product_list)
        #     will_move_index = int(count * random.random())
        #     driver.execute_script("arguments[0].scrollIntoView(true);", product_list[will_move_index])
        #     driver.execute_script("window.scrollBy(0, -300)")
        #     product_element = product_list[product_index].find_element_by_xpath(".//div[@class='image']")
        #     time.sleep(random.random())
        #     actions.reset_actions()
        #     actions.move_to_element_with_offset(product_element, 300, 300)
        #     time.sleep(random.random() / 4 + 0.5)
        #     ran_interval = random.randrange(1, 5)
        #     time.sleep(ran_interval)
        product_list = driver.find_elements_by_xpath("//div[@data-component-type='s-search-result']")
        product_element = product_list[product_index].find_element_by_xpath(".//img[@class='s-image']")
        actions.reset_actions()
        actions.move_to_element_with_offset(product_element, 150, 150)
        time.sleep(random.random()/2 + 0.5)
        product_element.click()

    def get_information(self, driver, product_id, product_asin):
        # id = "aod-end-of-results"
        actions = webdriver.ActionChains(driver)
        result = []
        try:
            element = driver.find_element_by_link_text("See All Buying Options")
            result = self.get_info_operation(driver, "//span[@id='buybox-see-all-buying-choices']//a", product_id)
            return result
        except NoSuchElementException:
            pass

        try:
            element = driver.find_element_by_xpath("//div[@id='olpLinkWidget_feature_div']//a")
            top_and_list = self.get_primeproducts_list(driver, "//div[@id='olpLinkWidget_feature_div']//a", product_id, -1, product_asin)
            result.append(top_and_list['info'])
            ele_list = top_and_list['elelist']
            for ele_index in ele_list:
                result.append(self.get_primeproducts_list(driver, "//div[@id='olpLinkWidget_feature_div']//a", product_id, ele_index, product_asin))
            return result
        except NoSuchElementException:
            pass

        try:
            elements = driver.find_element_by_id("mbc-action-panel-wrapper").find_elements_by_class_name("mbc-offer-row")
            if len(elements) == 0:
                raise InputError
            element_index_array = []
            for index in range(len(elements)):
                product_price = self.price_text_to_float(elements[index].find_element_by_xpath(".//span[contains(@id, 'mbc-price')]").get_attribute('innerHTML'))
                element_index_array.append({'index': index, 'product_price': product_price})
            element_index_array.sort(key=self.price_order)

            elements_length = len(elements)
            if elements_length > 3:
                elements_length = 3
            for index in range(elements_length):
                elements = driver.find_element_by_id("mbc-action-panel-wrapper").find_elements_by_class_name(
                    "mbc-offer-row")
                element = elements[element_index_array[index]['index']]
                product_price = element.find_element_by_xpath(".//span[contains(@id, 'mbc-price')]").text
                if not product_price is None:
                    product_price = int(product_price.replace('¥', '').replace('￥', '').replace(',', ''))
                product_seller = element.find_element_by_xpath(".//span[contains(@class, 'mbcMerchantName')]").text
                try:
                    product_shipper = element.find_element_by_xpath(".//span[contains(@id,'mbc-shipping-free']").text
                except:
                    product_shipper = ""
                    pass
                add_cart_button = element.find_element_by_xpath(".//span[contains(@id,'mbc-buybutton-addtocart')]")
                actions.reset_actions()
                actions.move_to_element_with_offset(add_cart_button, 10, 10)
                add_cart_button.click()
                try:
                    element = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.CLASS_NAME, "ewc-item-content"))
                    )
                    actions.reset_actions()
                    actions.move_to_element_with_offset(element, 10, 10)
                    input_element = element.find_element_by_xpath(".//span[@class='ewc-button-text']")
                    actions.move_to_element_with_offset(input_element, 5, 5)
                    input_element.click()
                    val_element = WebDriverWait(element, 10).until(
                        EC.presence_of_element_located((By.XPATH, ".//li[@data-value='10+']"))
                    )
                    val_element.click()
                    input_element = element.find_element_by_xpath(".//input[@data-old-value]")
                    input_element.send_keys("999")
                    update_button = element.find_element_by_xpath(".//span[@class='ewc-button-input']")
                    actions.move_to_element_with_offset(update_button, 10, 10)
                    update_button.click()
                    alert_element = WebDriverWait(element, 10).until(
                        EC.presence_of_element_located((By.XPATH, ".//div[@class='ewc-alert-content']"))
                    )
                    alert_text = alert_element.text.slice(" ")
                    if "This seller has only" in alert_element.text:
                        product_stocks = int(alert_text[alert_text.index('only') + 1])
                    else:
                        product_stocks = int(alert_text[alert_text.index('only') + 1])
                    delete_button = element.find_element_by_link_text("Delete")
                    actions.move_to_element_with_offset(delete_button, 10, 10)
                    delete_button.click()
                    driver.back()
                except TimeoutException:
                    pass
                result.append((product_id, product_seller, product_price, product_stocks, product_shipper))
            return result
        except NoSuchElementException:
            pass
        except InputError:
            pass
        if self.is_exist(driver, "id", "newAccordionRow"):
            div_element = driver.find_element_by_id("newAccordionRow")
            div_element.find_element_by_xpath(".//a[@data-action='a-accordion']").click()
            product_price = self.price_text_to_float(div_element.find_element_by_id("newBuyBoxPrice").text)
            product_shipper = div_element.find_element_by_id("tabular-buybox-truncate-0").text
            product_seller = div_element.find_element_by_id("tabular-buybox-truncate-1").text
            add_cart_button = div_element.find_element_by_id("add-to-cart-button")
            product_stocks, stocks_status  = self.get_stocks_from_addcart(driver, add_cart_button, product_asin)
            result.append((product_id, product_seller, product_price, product_stocks, product_shipper, stocks_status))
        elif self.is_exist(driver, "xpath", "//div[@class='a-box a-last']"):
            div_element = driver.find_element_by_xpath("//div[@class='a-box a-last']")
            product_price = self.price_text_to_float(div_element.find_element_by_id("price_inside_buybox").text)
            product_shipper = div_element.find_element_by_id("tabular-buybox-truncate-0").text
            product_seller = div_element.find_element_by_id("tabular-buybox-truncate-1").text
            add_cart_button = div_element.find_element_by_id("add-to-cart-button")
            product_stocks, stocks_status = self.get_stocks_from_addcart(driver, add_cart_button, product_asin)
            result.append((product_id, product_seller, product_price, product_stocks, product_shipper, stocks_status))
        else:
            print("Not found product information...")

        return result

    def get_prime_info(self, product_element):
        try:
            element = product_element.find_element_by_xpath(".//i[contains(@class, 'a-icon-prime')]")
            return 1
        except:
            pass
        return 3

    def get_description(self, driver):
        description = []
        try:
            element = driver.find_element_by_id("productOverview_feature_div")
            description.append(element.get_attribute('innerHTML'))
        except:
            pass
        try:
            element = driver.find_element_by_id("feature-bullets")
            description.append(element.get_attribute('innerHTML'))
        except:
            pass
        try:
            element = driver.find_element_by_id("detailBullets_feature_div")
            description.append(element.get_attribute('innerHTML'))
        except:
            pass
        try:
            element = driver.find_element_by_id("dpx-product-description_feature_div")
            description.append(element.get_attribute('innerHTML'))
        except:
            pass
        try:
            element = driver.find_element_by_id("aplus3p_feature_div")
            description.append(element.get_attribute('innerHTML'))
        except:
            pass
        try:
            element = driver.find_element_by_id("prodDetails")
            description.append(element.get_attribute('innerHTML'))
        except:
            pass

        return description

    def click_next_page_num(self, driver):
        actions = webdriver.ActionChains(driver)
        try:
            target_element = driver.find_element_by_xpath("//li[@class='a-last']/a")
        except NoSuchElementException:
            target_element = None
            pass

        if not target_element is None:
            actions.reset_actions()
            actions.move_to_element_with_offset(target_element, 10, 10).perform()
            time.sleep(random.random() / 2 + 0.5)
            target_element.click()
            return True
        else:
            return False

    def check_page_count(self, driver):
        try:
            element = driver.find_element_by_xpath("//div[contains(@class,'apb-browse-searchresults-footer')]//a[@class='a-link-normal']")
            actions = webdriver.ActionChains(driver)
            actions.reset_actions()
            actions.move_to_element_with_offset(element, 10, 10)
            time.sleep(random.random() / 2 + 0.5)
            element.click()
            return True
        except NoSuchElementException:
            pass
        try:
            element = driver.find_element_by_xpath("//li[@class='a-last']")
            return True
        except NoSuchElementException:
            return False

    def get_images_url(self, driver, product_index):
        actions = webdriver.ActionChains(driver)

        product_list = driver.find_elements_by_xpath("//div[@data-component-type='s-search-result']")
        driver.execute_script("arguments[0].scrollIntoView(true);", product_list[product_index])
        driver.execute_script("window.scrollBy(0, -300)")
        product_element = product_list[product_index].find_element_by_xpath(".//img[@class='s-image']")
        time.sleep(random.random())
        actions.reset_actions()
        actions.move_to_element_with_offset(product_element, 150, 150)
        time.sleep(random.random() / 4 + 0.5)
        product_element.click()
        actions.reset_actions()
        driver.switch_to.window(driver.window_handles[1])

    def login_amazon(self, driver, email, password):
        actions = webdriver.ActionChains(driver)
        try:
            element = driver.find_element_by_id("nav-link-accountList")
            actions.reset_actions()
            actions.move_to_element_with_offset(element, 10, 10).perform()
            time.sleep(random.random() / 2 + 0.5)
            login_element = driver.find_element_by_xpath("//a[@data-nav-ref='nav_signin']")
            actions.move_to_element_with_offset(login_element, 10, 10).perform()
            time.sleep(random.random() / 2 + 0.5)
            login_element.click()
            # time.sleep(1)

            element = driver.find_element_by_id("ap_email")
            element.send_keys(email)
            continu_element = driver.find_element_by_id("continue")
            continu_element.click()
            element = driver.find_element_by_id("ap_password")
            element.send_keys(password)
            continu_element = driver.find_element_by_id("signInSubmit")
            continu_element.click()

            cookie_file = open(os.path.abspath(os.getcwd()) + "\\category_management\\scraping\\cookies.pkl", "wb")
            pickle.dump(driver.get_cookies(), cookie_file)
            cookie_file.close()
        except NoSuchElementException:
            print("Already logged in!")
            try:
                address_element = driver.find_element_by_id("nav-global-location-popover-link")
                address_element.click()

                WebDriverWait(driver, 5).until(
                    EC.presence_of_element_located((By.ID, "GLUXZipUpdateInput_0"))
                )
                element = driver.find_element_by_id("GLUXZipUpdateInput_0")
                element.send_keys("100")
                element = driver.find_element_by_id("GLUXZipUpdateInput_1")
                element.send_keys("0401")

                driver.find_element_by_xpath("//span[@id='GLUXZipUpdate']//input[@type='submit']").click()
                WebDriverWait(driver, 5).until(
                    EC.presence_of_element_located((By.ID, "GLUXConfirmClose"))
                )
                # driver.find_element_by_id("GLUXConfirmClose").click()
            except NoSuchElementException:
                pass
            try:
                WebDriverWait(driver, 5).until(
                    EC.presence_of_element_located((By.ID, "icp-nav-flyout"))
                )
                # lang_element = driver.find_element_by_xpath("//a[@id='icp-nav-flyout']/span")
                # actions.reset_actions()
                # actions.move_to_element_with_offset(lang_element, 10, 10).perform()
                time.sleep(.3)
                jp_element = driver.find_element_by_xpath("//a[@href='#switch-lang=ja_JP']")
                jp_element.click()
                # driver.execute_script("documentgetElementById('main')")
            except NoSuchElementException:
                pass
        return driver.current_window_handle
        # time.sleep(1)

    def image_loading_check(self, driver):
        try:
            big_img_url = driver.find_element_by_xpath("//div[@id='ivLargeImage']/img").get_attribute("src")
            if "loading" in big_img_url:
                return True
            if big_img_url == "":
                return True
            return False
        except Exception:
            return True

    def scroll_shim(self, passed_in_driver, object):
        x = object.location['x']
        y = object.location['y']
        scroll_by_coord = 'window.scrollTo(%s,%s);' % (
            x - int(passed_in_driver.get_window_size()['width']/2),
            y - int(passed_in_driver.get_window_size()['height']/2)
        )
        scroll_nav_out_of_way = 'window.scrollBy(0, -120);'
        passed_in_driver.execute_script(scroll_by_coord)
        passed_in_driver.execute_script(scroll_nav_out_of_way)

    def is_exist(self, driver, attr, text):
        if attr == "id":
            try:
                element = driver.find_element_by_id(text)
                return True
            except NoSuchElementException:
                return False
        elif attr == "xpath":
            try:
                element = driver.find_element_by_xpath(text)
                return True
            except NoSuchElementException:
                return False
        elif attr == "class":
            try:
                element = driver.find_element_by_class_name(text)
                return True
            except NoSuchElementException:
                return False

    def price_order(self, e):
        return e['product_price']

    def get_primeproducts_list(self, driver, command_text, product_id, ele_index, product_asin):
        actions = webdriver.ActionChains(driver)
        element = driver.find_element_by_xpath(command_text)
        actions.reset_actions()
        actions.move_to_element_with_offset(element, 50, 50)
        element.click()
        time.sleep(1)
        try:                    #############       get top product info    ############
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "aod-pinned-offer"))
            )
            while not self.is_exist(driver, "id", "aod-end-of-results"):
                driver.execute_script("document.getElementById('all-offers-display-scroller').scrollTo(0, document.body.scrollHeight);")
                if self.is_exist(driver, "id", "aod-show-more-offers"):
                    try:
                        driver.find_element_by_id("aod-show-more-offers").click()
                    except Exception:
                        pass
                time.sleep(.5)

            if ele_index == -1:
                if self.is_exist(driver, "id", "aod-pinned-offer-show-more-link"):
                    driver.find_element_by_id("aod-pinned-offer-show-more-link").click()
                div_element = driver.find_element_by_id("aod-pinned-offer")
                product_price = self.price_text_to_float(div_element.find_element_by_xpath(".//span[@class='a-price-whole']").text)
                product_shipper = div_element.find_element_by_xpath(".//div[@id='aod-offer-shipsFrom']//div[contains(@class,'a-col-right')]").text
                product_seller = div_element.find_element_by_xpath(".//div[@id='aod-offer-soldBy']//div[contains(@class,'a-col-right')]").text

                list_div_element = driver.find_element_by_id("aod-offer-list")
                elements = list_div_element.find_elements_by_xpath("./div[@id='aod-offer']")
                element_index_array = []
                for index in range(len(elements)):
                    if not self.get_prime_info(elements[index]) == 1:
                        continue
                    product_price = self.price_text_to_float(
                        elements[index].find_element_by_class_name("a-price-whole").text)
                    element_index_array.append({'index': index, 'product_price': product_price})
                element_index_array.sort(key=self.price_order)
                elements_length = len(element_index_array)
                if elements_length > 2:
                    elements_length = 2
                index_array = []
                for i in range(elements_length):
                    index_array.append(element_index_array[i]['index'])

                product_stocks, stocks_status = self.get_stocks_from_addcart(driver, div_element.find_element_by_xpath(".//input[@name='submit.addToCart']"), product_asin)
                result = (product_id, product_seller, product_price, product_stocks, product_shipper, stocks_status)
                return {'info': result, 'elelist': index_array}
            else:
                list_div_element = driver.find_element_by_id("aod-offer-list")
                div_element = list_div_element.find_elements_by_xpath("./div[@id='aod-offer']")[ele_index]
                product_price = self.price_text_to_float(div_element.find_element_by_xpath(".//span[@class='a-price-whole']").text)
                product_shipper = div_element.find_element_by_xpath(".//div[@id='aod-offer-shipsFrom']//div[contains(@class,'a-col-right')]").text
                product_seller = div_element.find_element_by_xpath(".//div[@id='aod-offer-soldBy']//div[contains(@class,'a-col-right')]").text
                product_stocks, stocks_status = self.get_stocks_from_addcart(driver, div_element.find_element_by_xpath(".//input[@name='submit.addToCart']"), product_asin)
                return (product_id, product_seller, product_price, product_stocks, product_shipper, stocks_status)
        except TimeoutException:
            pass
        return result


    def get_stocks_from_addcart(self, driver, addcart_element, product_asin):
        actions = webdriver.ActionChains(driver)
        addcart_element.click()
        confirm_state = False
        try:
            WebDriverWait(driver, 2).until(
                EC.presence_of_element_located((By.XPATH, "//input[@name='submit.addToCart' and @value='addToCart']"))
            )
            confirm_state = True
            driver.find_element_by_xpath("//input[@name='submit.addToCart' and @value='addToCart']").click()     #####   Edit Cart click
        except TimeoutException:
            pass
        if self.is_exist(driver, "xpath", "//span[@id='attach-sidesheet-view-cart-button']"):
            try:
                WebDriverWait(driver, 5).until(
                    EC.presence_of_element_located((By.XPATH, "//div[@id='attach-add-to-cart-message-spinner'][contains(@class, 'aok-hidden')]"))
                )
                driver.find_element_by_xpath("//span[@id='attach-sidesheet-view-cart-button']//input").click()
            except TimeoutException:
                pass
        try:
            # WebDriverWait(driver, 1).until(
            #     EC.presence_of_element_located((By.ID, "hlb-view-cart-announce"))
            # )
            driver.find_element_by_id("hlb-view-cart-announce").click()     #####   Edit Cart click
        except NoSuchElementException:
            pass
        try:
            driver.find_element_by_xpath("//form[@id='attach-view-cart-button-form']//input[@type='submit']").click()     #####   Edit Cart click
        except NoSuchElementException:
            pass
        try:
            div_element = WebDriverWait(driver, 1).until(
                EC.presence_of_element_located((By.XPATH, "//div[@data-asin='" + product_asin + "']"))
            )
            # actions.reset_actions()
            # actions.move_to_element_with_offset(element, 10, 10)
            try:
                select_element = div_element.find_element_by_xpath(".//span[@data-action='a-dropdown-button']")    #####      select input click #####
                self.scroll_shim(driver, select_element)
                select_element.click()
            except NoSuchElementException:
                print("I can't get product stocks")
                div_element.find_element_by_xpath(
                    ".//div[contains(@class,'sc-action-links')]//input[@value='Delete']").click()
                driver.back()
                driver.back()
                return (-1, 1)
            # WebDriverWait(driver, 1).until(
            #     EC.presence_of_element_located((By.XPATH, "//div[@data-asin='" + product_asin + "']//a[@id='dropdown1_10']"))
            # )
            try:
                driver.find_element_by_id("dropdown1_10").click()
                WebDriverWait(driver, 5).until(
                    EC.presence_of_element_located((By.XPATH, "//div[@data-asin='" + product_asin + "']//input[@name='quantityBox']"))
                )
                input_element = driver.find_element_by_xpath("//div[@data-asin='" + product_asin + "']//input[@name='quantityBox']")            ########   input 999            ###########
                input_element.send_keys("999")
                update_element = driver.find_element_by_xpath("//div[@data-asin='" + product_asin + "']//a[@data-action='update']")
                self.scroll_shim(driver, update_element)
                update_element.click()                                                                                                  ########    update click        #########
            except Exception:
                print("select 10, input 999, press update error!")
                pass
            try:
                WebDriverWait(driver, 2).until(
                    EC.presence_of_element_located((By.XPATH, "//div[@class='a-alert-content']"))
                )
                alert_element = driver.find_element_by_xpath("//div[@class='a-alert-content']")
                if "seller has only" in alert_element.text:
                    # product_stocks = int(alert_text[alert_text.index('only') + 1])
                    product_stocks = self.str_to_stocks(alert_element.text)
                    stocks_status = 0
                elif "seller has a limit of" in alert_element.text or "この出品者からは、ご注文数はお一人様" in alert_element.text:
                    # product_stocks = int(alert_text[alert_text.index('of')+1])
                    product_stocks = self.str_to_stocks(alert_element.text)
                    stocks_status = 2
                elif "Your Cart has space for an additional quantity of" in alert_element.text or "カートに保存できる商品の最大数を超えたため" in alert_element.text:
                    product_stocks = self.str_to_stocks(alert_element.text)
                    stocks_status = 3
                else:
                    # product_stocks = int(alert_text[alert_text.index('only') + 1])
                    product_stocks = self.str_to_stocks(alert_element.text)
                    stocks_status = 4
            except TimeoutException:
                product_stocks = 999
                stocks_status = 3
                pass

            time.sleep(.2)
            try:
                driver.find_element_by_xpath("//div[@data-asin='" + product_asin + "']//input[@value='Delete']").click()
            except Exception:
                print("Click delete error!")
                pass
            driver.back()
            driver.back()
            if confirm_state:
                driver.back()
            return (product_stocks, stocks_status)
        except TimeoutException:
            pass
        # try:
        #     element = WebDriverWait(driver, 10).until(
        #         EC.presence_of_element_located((By.CLASS_NAME, "ewc-item-content"))
        #     )
        #     actions.reset_actions()
        #     actions.move_to_element_with_offset(element, 10, 10)
        #     input_element = element.find_element_by_xpath(".//span[@class='ewc-button-text']")
        #     actions.move_to_element_with_offset(input_element)
        #     input_element.click()
        #     val_element = WebDriverWait(element, 10).until(
        #         EC.presence_of_element_located((By.XPATH, ".//li[@data-value='10+']"))
        #     )
        #     val_element.click()
        #     input_element = element.find_element_by_xpath(".//input[@data-old-value]")
        #     input_element.send_keys("999")
        #     update_button = element.find_element_by_xpath(".//span[@class='ewc-button-input']")
        #     actions.move_to_element_with_offset(update_button, 10, 10)
        #     update_button.click()
        #     alert_element = WebDriverWait(element, 10).until(
        #         EC.presence_of_element_located((By.XPATH, ".//div[@class='ewc-alert-content']"))
        #     )
        #     alert_text = alert_element.text.slice(" ")
        #     if "This seller has only" in alert_element.text:
        #         product_stocks = int(alert_text[alert_text.index('only') + 1])
        #     else:
        #         product_stocks = int(alert_text[alert_text.index('only') + 1])
        #     delete_button = element.find_element_by_link_text("Delete")
        #     actions.move_to_element_with_offset(delete_button, 10, 10)
        #     delete_button.click()
        #     driver.back()
        # except TimeoutException:
        #     pass


        return (-1, 4)


    def price_text_to_float(self, price_text):
        if not price_text is None:
            return int(price_text.replace('¥', '').replace('￥', '').replace(',', '').replace('\n', ''))

    def str_to_stocks(self, text):
        val = re.sub("[^0-9]", "", text)
        if not val == "":
            return int(val)
        return 999

    def login_keepa(self, driver, user_name, password):
        try:
            element = WebDriverWait(driver, 30).until(
                EC.presence_of_element_located((By.ID, "panelUserRegisterLogin"))
            )
            driver.find_element_by_xpath("//span[@id='panelUserRegisterLogin']").click()
            driver.find_element_by_id("username").send_keys(user_name)
            driver.find_element_by_id("password").send_keys(password)
            driver.find_element_by_id("submitLogin").click()

            cookie_file = open(os.path.abspath(os.getcwd()) + "\\category_management\\scraping\\cookies.pkl", "wb")
            pickle.dump(driver.get_cookies(), cookie_file)
            cookie_file.close()
        except TimeoutException:
            print("Aready Logged in")

        return driver.current_window_handle
# threadCtrl = scrapeThreadController(connection)
# class threadController():
#     def __init__(self):
#         self.proposerList = []
#         self.threadsList = []
#         self.profileList = range(1, 10)
#     def addProposer(self, memberId):
#         self.proposerList.append( memberId )
#         self.startThread()
#
#     def removeThread(self, threadName, profile_index):
#         def filter_name_index(thread):
#             if thread.name == threadName:
#                 return False
#             return True
#         self.threadsList = filter(filter_name_index, self.threadsList)
#         self.startThread()
#
#     def startThread(self):
#         print(self.proposerList)
#
#         if len(self.proposerList) == 0 or len(self.threadList) > 3:
#             return
#         scrape_thread = scrapeThread(connection, self.proposerList[0], self.profileList.pop())
#         self.proposerList.remove(self.proposerList[0])
#         scrape_thread.start()
#         self.threadsList.append(scrape_thread)

def start(member_id):
    print("hi")
    print()
    # os.system('python ' + os.path.abspath(os.getcwd()) + '/category_management/scraping/5.py')
    # os.system('python ' + os.path.abspath(os.getcwd()) + '/project/5.py')

    # scrape_thread = scrapeThread(connection, id)
    # scrape_thread.start()
    # threadCtrl.addProposer(member_id)