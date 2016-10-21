package com.barcode.sample.services;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public interface BarcodeGenService {

	public void init(String pBarcodeType);
	
	public void createBarcode(String barcodeType, String barcodeData, String fileFormat, boolean isAntiAliasing, int dpi, String outputFile);
	
	public void createQRcode( String saveQRcodeImgPath );
		
}
