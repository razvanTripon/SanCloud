<%@page import="java.sql.*,
                java.util.*,
                java.text.*,
				birtjob.*,
                java.io.*"
%>

<%!

    int STARCHAR = 155;
    int STOPCHAR = 156;
    int CHKSTART = 105;
    int CHKREMDR = 103;

    public static final Object[][] COD_GRAMAJ ={
        {new Double(80),"01"},
        {new Double(85),"02"},
        {new Double(90),"03"},
        {new Double(95),"04"},
        {new Double(100),"05"},
        {new Double(105),"06"},
        {new Double(110),"07"},
        {new Double(115),"08"},
        {new Double(120),"09"},
        {new Double(125),"10"},
        {new Double(130),"11"},
        {new Double(135),"12"},
        {new Double(140),"13"},
        {new Double(145),"14"},
        {new Double(150),"15"},
        {new Double(155),"16"},
        {new Double(160),"17"},
        {new Double(165),"18"},
        {new Double(170),"19"},
        {new Double(175),"20"},
        {new Double(180),"21"},
        {new Double(185),"22"},
        {new Double(190),"23"},
        {new Double(195),"24"},
        {new Double(200),"25"},
    };

    public static final Object[][] COD_LATIMI ={
        {new Double(175),"01"},
        {new Double(183),"02"},
        {new Double(195),"03"},
        {new Double(202.5),"04"},
        {new Double(210),"05"},
        {new Double(215),"06"},
        {new Double(143),"07"},
        {new Double(153),"08"},
        {new Double(160),"09"},
        {new Double(162),"10"},
        {new Double(163),"11"},
        {new Double(170),"12"},
        {new Double(172),"13"},
        {new Double(185),"14"},
        {new Double(188),"15"},
        {new Double(198),"16"},
        {new Double(203),"17"},
        {new Double(217),"18"},
        {new Double(205),"19"},
        {new Double(202),"20"},
    };

  private static String readFileAsString(String filePath)
      throws java.io.IOException{
          StringBuffer fileData = new StringBuffer(1000);
          BufferedReader reader = new BufferedReader(
                  new FileReader(filePath));
          char[] buf = new char[1024];
          int numRead=0;
          while((numRead=reader.read(buf)) != -1){
              fileData.append(buf, 0, numRead);
          }
          reader.close();
          return fileData.toString();
      }
	  
    private String getCodificare(Object[][] codes, double val)
    {
        for (int i = 0; i < codes.length; i++) {
            double cod = ((Double)codes[i][0]).doubleValue();
            if(cod == val){
                return (String)codes[i][1];
            }
        }
        return "00";
    }

    private String generateBarCode(String code){
        String res = "" ;
        int chkSum = CHKSTART;
        if (code.length() % 2 ==1)
            return null;
        int len = code.length() / 2;
        int[] unicode = new int[len];
        
        int idx = 0;
        for (int i = 0; i < code.length(); i= i+2) {
            idx++;
            byte pair = new Byte(code.substring(i, i+2)).byteValue();
            unicode[idx-1]  = computeChar(pair);
            chkSum += pair*idx;
        }

        chkSum = chkSum % CHKREMDR;

        res = decimalPoint(STARCHAR);
        for (int i = 0; i < unicode.length; i++) {
            res += decimalPoint(unicode[i]);
        }
        res += decimalPoint(computeChar(chkSum));
        res += decimalPoint(STOPCHAR);
//        res = (char)STARCHAR + res + computeChar(chkSum) + (char)STOPCHAR;
        return res;
    }

    private String decimalPoint(int v){
		if(v == 128)
			v = 8364;
        return "&#" + v + ";" ;
    }

    private int computeChar(int v){
        int ret = 128;
        if(v == 0)
            ret = 128;
		else{
			if(v >=1 && v<=94)
				ret = v+32;
			else
				ret = v+50;
		}
        return ret;
    }

    private int computeChar(String pair){
        int v = new Integer(pair).intValue();
        return computeChar(v);
    }

    private String zeroFill(String str, int count){
        while (str.length() < count)
            str = "0" + str;
        return str;
    }
    
    private String zeroFill(int nr, int zeroes){
        String ptrn = "";
        for (int i = 0; i < zeroes; i++) 
            ptrn += "0";
        DecimalFormat f = new DecimalFormat(ptrn);
        return f.format(nr);
    }

    private String getCodReelPaper(String sortiment, int gramaj, int latime, int greutate, int lungime){
		String baza = sortiment + zeroFill(gramaj, 3) + zeroFill(latime, 4) + zeroFill(greutate, 4) + zeroFill(lungime, 5);
		return baza;
	}

    private String getCodReelIdentifier(String nrBobina, String codProducator){
		String baza = zeroFill(nrBobina, 10) + zeroFill(codProducator, 4);
		return baza;
	}

	private Object getValue(Object value, Object defVal){
		return value == null ? defVal : value;
	}
	
%>

<%

	String firmaSig = request.getParameter("firmaSig");
	String selectedDate = request.getParameter("selectedDate");
	String uid = request.getParameter("uid");
	String tip = request.getParameter("tip");
//	String barcode = request.getParameter("barcode");
	String barcode = "" ;
	String codFurnizor = "01" ;

	BirtJob job = new BirtJob(firmaSig);
	String Url = job.getURL();
	String User = job.getUser();
	String Password = job.getPassword();

	try{
		Class.forName("com.mysql.jdbc.Driver").newInstance();
	   }catch (Exception ex){out.println(ex.toString());}
	Connection conn = null;
	try{
		conn = DriverManager.getConnection(Url,User,Password);
	   }catch (SQLException ex){out.println(ex.toString());}

	   
	DecimalFormat DG = new DecimalFormat("###0.00");
	DecimalFormat DF = new DecimalFormat("###0");
	SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
//	SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

	String load_pl = "";
	double latime = 0;
	int latimen = 0;
	int lungime = 0;
	int greutate = 0;
	String nrBobina = "";
	String pdata = "";
	String d_ext = "";
	String d_int = "";
	String bobina = "";
	String codp = "";
	String cf = "";
	String sortiment = "";
	int gramaj = 0;
	String comanda = "";
	String numep = "";
	String locp = "";
	String tarap = "";

	String codSortiment = "";

	try{
		String sql;
		PreparedStatement prepStmt;
		ResultSet res;
        String an = selectedDate.substring(6,10);
        sql = "select * from datefirm where DATA in (select max(data) from datefirm where data<=?)";
        prepStmt = conn.prepareStatement(sql);
        prepStmt.setLong(1, new Long(an).longValue());
		res = prepStmt.executeQuery();
		if(res.next())
		  load_pl = res.getString("LOC");
        prepStmt.close();
	

	
	
		sql = "select c.*, nomp.denumire as den_prod, nomf.nume as nume_client, SUBSTRING_INDEX(SUBSTRING_INDEX(nomp.denumire,' ', 2),' ', -1) as sortiment, nomp.gramaj, "+
			  "nomf.localitate as loc_client, nomf.tara as tara_client, nomp.cpsa as c_sortiment, nompp.cpsa as c_sortiment_p "+
			  "from cantarire c "+
			  "left outer join nomp nomp on (nomp.codp = c.cod_produs) "+
			  "left outer join nomf nomf on (nomf.cod = c.client) "+
			  "left outer join nomp nompp on (nompp.codp = nomp.par) "+
			  "where c.uid=? ";
        prepStmt = conn.prepareStatement(sql);
        prepStmt.setString(1, uid);
		res = prepStmt.executeQuery();
		if(res.next()){
			latime = res.getDouble("latime");
			latimen = (int)Math.round(latime * 10);
			lungime = (int)Math.round(res.getDouble("LUNGIME"));
			greutate = (int)Math.round(res.getDouble("GREUTATE"));
			nrBobina = res.getString("NR_BOBINA");
			pdata = dateFormat.format(res.getDate("DATA"));
			d_ext = DF.format(res.getDouble("DIAM_EXTERIOR"));
			d_int = DG.format(res.getDouble("DIAM_INTERIOR"));
			bobina = res.getString("BOBINA");
			sortiment = (String)getValue(res.getString("SORTIMENT"), "");
			gramaj = (int)Math.round(res.getDouble("GRAMAJ"));
			comanda = res.getString("NR_COMANDA");
			numep = res.getString("NUME_CLIENT");
			locp = res.getString("LOC_CLIENT");
			tarap = (String)getValue(res.getString("TARA_CLIENT"), "");
			codSortiment = (String)getValue(res.getString("c_sortiment"), "");
			if(codSortiment.length() == 0)
				codSortiment = (String)getValue(res.getString("c_sortiment_p"), "");

      //==========================================================
      // 5 mai 2015 = creaza in folderul "eticheta" un fisier csv
      // care contine toate informatiile legate de o bobina
      //==========================================================
      Statement stmff = conn.createStatement();
      String fisExcel= "/eticheta/bobina_"+pdata.substring(2,4)+nrBobina .trim() +".csv";
      File f = new File(fisExcel); if(f.exists() && !f.isDirectory())  f.delete() ;
      String cQuery="SELECT DATA, c.cod_produs, np.denumire, c.client, nf.nume, nr_comanda,"+
         " nr_tambur, c.nr_bobina, c.tura, c.latime, c.lungime, c.diam_interior, c.diam_exterior, c.greutate "+
         " INTO OUTFILE '"+fisExcel+"' FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"+'"'+"' LINES TERMINATED BY '\n'"+
         " FROM cantarire c, nomp np, nomf nf WHERE c.cod_produs=np.codp AND c.client=nf.cod and c.nr_bobina='"+nrBobina +"'";
      ResultSet rstd = stmff.executeQuery(cQuery);
      stmff.close(); rstd.close();
      //=========================================================
		}
        prepStmt.close();
		conn.close();
	   }catch(Exception e){
	     //System.out.println(e.getMessage());
		 e.printStackTrace();
	     //out.print(e.printStackTrace());
		 return;
	   }

	String codProducator = "0946";
	String reelCode = zeroFill(codSortiment, 2) + zeroFill(gramaj, 3) + zeroFill(latimen, 4) + zeroFill(greutate, 4) + zeroFill(lungime, 5);

//	String reelIDCode = zeroFill(nrBobina, 10) + zeroFill(codProducator, 4);

String nrBobina_ = pdata.substring(2,4)+nrBobina; // ultimele 2 cifre din an + nrBobina
String reelIDCode = zeroFill(nrBobina_, 10) + zeroFill(codProducator, 4);



	String reelBarCode = generateBarCode(reelCode);
	String reelIDBarCode = generateBarCode(reelIDCode);
//		ServletContext application = getServletConfig().getServletContext();
	String path = application.getRealPath("/");
//out.print("path=" + path);
//	String fileName = path+"ecopaper/template.htm";
	String fileName = path+"ecopaper/"+tip+"/template.htm";

	String codGramaj = getCodificare(COD_GRAMAJ, new Double(gramaj).doubleValue());
	String codLatime = getCodificare(COD_LATIMI, new Double(latime).doubleValue());
	String codLungime = zeroFill(lungime, 4);
	String codBobina = zeroFill(nrBobina, 5);	
	
	barcode = "*" + codFurnizor + codSortiment + codGramaj + codLatime + codLungime + codBobina + "*";

    try {
			String content = readFileAsString(fileName);
			content = content.replaceAll("#IMGPATH#",tip+"/");
			content = content.replaceAll("#BARCODE#",barcode);
			content = content.replaceAll("#REELCODE#",reelCode);
			content = content.replaceAll("#REELBARCODE#",reelBarCode);
			content = content.replaceAll("#REELIDCODE#",reelIDCode);
			content = content.replaceAll("#REELIDBARCODE#",reelIDBarCode);
			content = content.replaceAll("#LOAD_PL#",load_pl);
			content = content.replaceAll("#WIDTH#",DG.format(latime));
			content = content.replaceAll("#WIDTHN#",DF.format(latimen));
			content = content.replaceAll("#LEN#",DF.format(lungime));
			content = content.replaceAll("#WGHT#",DF.format(greutate));
			content = content.replaceAll("#REEL#",nrBobina);
			content = content.replaceAll("#PDATE#",pdata);
			content = content.replaceAll("#D_EXT#",d_ext);
			content = content.replaceAll("#D_INT#",d_int);
			content = content.replaceAll("#SORTIMENT#",sortiment);
			content = content.replaceAll("#SUBST#",DF.format(gramaj));
			content = content.replaceAll("#CMD#",comanda);
			content = content.replaceAll("#F_SIG#",numep);
			content = content.replaceAll("#F_LOC#",locp);
			content = content.replaceAll("#F_TARA#",tarap);
			content = content.replaceAll("#CLIENT#",numep);
			out.print(content); 
        } 
		catch (IOException e) {
			e.printStackTrace();
			out.print(e.getMessage());
		}
%>