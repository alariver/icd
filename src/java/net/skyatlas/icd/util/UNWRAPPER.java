package net.skyatlas.icd.util;

import java.io.*;
import java.util.zip.*;
 
public class UNWRAPPER
{
  public static String Inflate( byte[] src )
  {
    try
    {
      ByteArrayInputStream bis = new ByteArrayInputStream( src );
      InflaterInputStream iis = new InflaterInputStream( bis );
      StringBuilder sb = new StringBuilder();
      for( int c = iis.read(); c != -1; c = iis.read() )
      {
        sb.append( (char) c );
      }
      String hello = new String(sb.toString().getBytes("iso8859-1"), "GBK");
      return hello;
    } 
    catch ( IOException e )
    {
      return null;
    }
    
  }
  
  
  public static byte[] Deflate( String src, int quality )
  {
    try
    {
      byte[] tmp = new byte[ src.length() + 100 ];
      Deflater defl = new Deflater( quality );
      defl.setInput( src.getBytes( "UTF-8" ) );
      defl.finish();
      int cnt = defl.deflate( tmp );
      byte[] res = new byte[ cnt ];
      for( int i = 0; i < cnt; i++ )
        res = tmp;
      return res;
    } 
    catch ( UnsupportedEncodingException e )
    {
      return null;
    }
    
  }
}