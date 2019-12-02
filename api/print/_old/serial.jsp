<% 
// Mihai 01 iunie 2012 
//scos de la sfarsit +", ORD#"+cCustom_nr 
%>
<%@page import="java.io.*"%>

	<%
	String cDenu=request.getParameter("denumire");
	String cLat=request.getParameter("latime");
	String cKg=request.getParameter("greutate");
	String cData=request.getParameter("data");
	String cNr=request.getParameter("numar");
        String cCustom_nr=request.getParameter("custom_nr");

  String aa="";
	java.util.Enumeration paramNames = request.getParameterNames();
    while(paramNames.hasMoreElements()) {
      String paramName = (String)paramNames.nextElement();
	  String parr = paramName;
      String par = paramName + "=";
      String[] paramValues = request.getParameterValues(paramName);
      String paramValue = paramValues[0];
      if (paramValue.length() == 0)
          par += "No Value";
      else
		  par += paramValue;
          System.out.println(par);
          aa=aa+par;
//          System.out.println("***** "+aa);
    }
 try {
    String cDen=cDenu.substring(cDenu.indexOf(" ")+1,cDenu.lastIndexOf(" "));
    String cCm=cDenu.substring(cDenu.indexOf(cDen)+cDen.length()+1,cDenu.lastIndexOf("/")-2);
    String cGr=cDenu.substring(cDenu.indexOf("/")+1,cDenu.length()-2);
    System.out.println(cDen+" * "+cCm+" * "+cGr);
    String cText=cDen+", BW "+cGr+" GSM, "+cLat+"CM, WEIGHT:"+cKg+"KG, REEL#16."+cNr;
     // ECOLINER, BW 170 GSM/210CM, WEIGHT:2368 KG, REEL#20934, ORD#09/08/2010
    System.out.println(cText);
    BufferedWriter outw = new BufferedWriter(new FileWriter("/ecopaper/serial.txt"));
		outw.write(cText);
  	outw.close();
    } catch (IOException e) { 
	out.println("ddddddddddddddddddddddddddddd"); 
	}

    %>
