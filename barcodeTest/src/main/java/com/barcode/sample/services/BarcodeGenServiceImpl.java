package com.barcode.sample.services;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;

import org.krysalis.barcode4j.BarcodeClassResolver;
import org.krysalis.barcode4j.BarcodeConstants;
import org.krysalis.barcode4j.BarcodeDimension;
import org.krysalis.barcode4j.BarcodeUtil;
import org.krysalis.barcode4j.DefaultBarcodeClassResolver;
import org.krysalis.barcode4j.impl.AbstractBarcodeBean;
import org.krysalis.barcode4j.impl.datamatrix.DataMatrixBean;
import org.krysalis.barcode4j.impl.datamatrix.SymbolShapeHint;
import org.krysalis.barcode4j.output.bitmap.BitmapCanvasProvider;
import org.krysalis.barcode4j.servlet.BarcodeServlet;
import org.krysalis.barcode4j.tools.MimeTypes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;



@Service
public class BarcodeGenServiceImpl implements BarcodeGenService {
    
	
	private static final Logger logger = LoggerFactory.getLogger(BarcodeGenServiceImpl.class);
	
    /**
	 * 바코드 생성전 데이터 초기화
	 * @param g
	 */
	public void init(String pBarcodeType) {
		/* 바코드 타입 
    	 * "codabar", "code39", "postnet", "intl2of5", "ean-128"
    	 * "royal-mail-cbc", "ean-13", "itf-14", "datamatrix", "code128"
    	 * "pdf417", "upc-a", "upc-e", "usps4cb", "ean-8", "ean-13" */
    	
		
		String barcodeType;
    	
		if(pBarcodeType == null || pBarcodeType.equals("")){
			barcodeType = "qrcode";
		}else{
			barcodeType = pBarcodeType;
		}
		
		logger.info("==> barcodeType : " + barcodeType);
    	
    	/* 바코드 데이터 */
    	String barcodeData = "http://filing.krx.co.kr/";
    	
    	/* 이미지의 dpi */
    	final int dpi = 200;
    	
    	/* 이미지 파일 포맷 
    	 * SVG, EPS, TIFF, JPEG, PNG, GIF, BMP */
    	String fileFormat = "jpg";
    	
    	/* 출력될 파일 */
    	String dir = "c:/";
    	String fileName = "barcodetest_"+barcodeType + "_" + dpi + "dpi";
    	String outputFile = dir + fileName+"."+fileFormat;
    	
    	/* anti-aliasing */
    	boolean isAntiAliasing = false;
    	
    	/* 이미지 생성 */
    	createBarcode(barcodeType, barcodeData, fileFormat, isAntiAliasing, dpi, outputFile);
	}
    
    /**
     * 바코드 생성
     * @param barcodeType
     * @param barcodeData
     * @param dpi
     */
	public void createBarcode(String barcodeType, String barcodeData, String fileFormat, boolean isAntiAliasing, int dpi, String outputFile){
    	try {
        	AbstractBarcodeBean bean = null;

        	
        	BarcodeClassResolver resolver = new DefaultBarcodeClassResolver();
        	Class clazz = resolver.resolveBean(barcodeType);
        	bean = (AbstractBarcodeBean)clazz.newInstance();
            bean.doQuietZone(true);
            bean.setModuleWidth(1.0);
        	
            //Open output file
            OutputStream out = new FileOutputStream(new File(outputFile));
            try {
                //Set up the canvas provider for monochrome JPEG output 
            	String mimeType = MimeTypes.expandFormat(fileFormat);
            	int imageType   = BufferedImage.TYPE_BYTE_BINARY;
                BitmapCanvasProvider canvas = new BitmapCanvasProvider(
                        out, mimeType, dpi, imageType, isAntiAliasing, 0);
                
                //Generate the barcode
                bean.generateBarcode(canvas, barcodeData);
            
                //Signal end of generation
                canvas.finish();
                
                logger.info("create image success.");
            } finally {
                out.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
	
	
	
	/**
     * 바코드 생성
     * @param barcodeType
     * @param barcodeData
     * @param dpi
     */
	public void createQRcode( String saveQRcodeImgPath ){
    	
		OutputStream os = null;
		
		try {
			
                String text = "kind.krx.co.kr";
                String savePath = saveQRcodeImgPath;
                
                
                QRCodeWriter qrCodeWriter = new QRCodeWriter(); 
                BitMatrix bitMatrix;
				bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 100, 100);
				
				os = new FileOutputStream(new File(savePath));
				
                //zxing에서 스트림에 파일을 뿌릴수있도록 메소드를 지원함. 
				MatrixToImageWriter.writeToStream(
				            		bitMatrix, 
				            		"png", 
				            		os
				);
							
							
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (WriterException e) {
			e.printStackTrace();
		} finally{
			try {
				os.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
   
		                


		
    }
	
	
	
	
	
}
		

