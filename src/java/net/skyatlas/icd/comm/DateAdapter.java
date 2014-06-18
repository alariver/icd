/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.comm;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import javax.servlet.ServletException;
import javax.xml.bind.annotation.adapters.XmlAdapter;

/**
 *
 * @author changzhenghe
 */
public class DateAdapter extends XmlAdapter<String,Date>{

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat(
        "yyyy-MM-dd");
    
    @Override
    public Date unmarshal(String v) throws Exception {
        if (v == null || "".equals(v)) {
            System.err.println("DateAdapter.unmarshal date input null:"+v);
            return null;
        }
        try {
            return new Date(dateFormat.parse(v).getTime());
        }
        catch(ParseException pe) {
            System.err.println("######################## DateAdapter unmarshal ERROR ####################"+v+"\n ex:"+pe);
            throw new ServletException(pe);
        }
    }

    @Override
    public String marshal(Date v) throws Exception {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    
}
