<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
	<title>바코드생성 샘플프로그램</title>
</head>
<body>

	<h1>
		바코드 생성기 샘플  
	</h1>
	
	<form>
	바코드 타입 
		<select name="barcode_type">
			<option value="codabar">codabar</option>
			<option value="code39">code39</option>
			<option value="postnet">postnet</option>
			<option value="intl2of5">intl2of5</option>
			<option value="ean-128">ean-128</option>
			<option value="royal-mail-cbc">royal-mail-cbc</option>
			<option value="ean-13">ean-13</option>
			<option value="itf-14">itf-14</option>
			<option value="datamatrix">datamatrix</option>
			<option value="code128">code128</option>
			<option value="pdf417">pdf417</option>
			<option value="upc-a">upc-a</option>
			<option value="upc-e">upc-e</option>
			<option value="usps4cb">usps4cb</option>
			<option value="ean-8">ean-8</option>
			<option value="ean-13">ean-13</option>
		</select>
		<input type="submit">
	</form>
    	 
</body>
</html>
