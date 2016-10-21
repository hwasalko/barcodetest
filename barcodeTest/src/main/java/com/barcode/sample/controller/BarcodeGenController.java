package com.barcode.sample.controller;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.barcode.sample.services.BarcodeGenService;

/**
 * Handles requests for the application home page.
 */
@Controller
public class BarcodeGenController {
	
	private static final Logger logger = LoggerFactory.getLogger(BarcodeGenController.class);
		
	@Autowired
	private BarcodeGenService barcodeGenService;
	
	
	
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@RequestMapping(value = "/barcode4j")
	public String barcode4j(HttpServletRequest request, Model model) {
		
		String pBarcodeType	= 	request.getParameter("barcode_type") == null ? "" : request.getParameter("barcode_type").toString();
		
		logger.info("pBarcodeType is : " + pBarcodeType);
		
		barcodeGenService.init(pBarcodeType);
		
		return "barcode4j";
	}
	
	
	
	/**
	 * QR코드 zxing
	 */
	@RequestMapping(value = "/qrcode")
	public String qrcode(HttpServletRequest request, Model model) {
		
		logger.info("QRcode gen... ");
		
		String saveQRcodeImgPath = "C:/qrcode.jpg";
        
        logger.info("QR코드 이미지 파일 저장경로 => " + saveQRcodeImgPath );
        
		
		barcodeGenService.createQRcode( saveQRcodeImgPath );
		
		return "qrcode";
	}
	
}
