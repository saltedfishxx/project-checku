import cv2
import sys
import pytesseract
 
def ocr(link):
 
  if len(link) < 2:
    print('Usage: python ocr_simple.py image.jpg')
    sys.exit(1)
   
  # Read image path from command line
  imPath = link
     
  # Uncomment the line below to provide path to tesseract manually
  # pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'
 
  # Define config parameters.
  # '-l eng'  for using the English language
  # '--oem 1' for using LSTM OCR Engine
  config = ('-l eng --oem 1 --psm 11')
 
  # Read image from disk
  im = cv2.imread(imPath, cv2.IMREAD_COLOR)
 
  # Run tesseract OCR on image
  text = pytesseract.image_to_string(im, config=config)
 
  # Print recognized text
  print(text)