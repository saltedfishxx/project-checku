import cv2
import sys
import pytesseract
 
def ocr(link):
  imPath = link

  config = ('-l eng --oem 1 --psm 11')
 
  im = cv2.imread(imPath, cv2.IMREAD_COLOR)
 
  text = pytesseract.image_to_string(im, config=config)
 
  print(text)