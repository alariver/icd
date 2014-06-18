/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.dao.daoImpl;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashSet;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.sql.DataSource;
import net.skyatlas.icd.domain.IcdDisease;
import net.skyatlas.icd.util.MemoryGrid;
import net.skyatlas.icd.util.SearchPath;
import oracle.jdbc.pool.OracleDataSource;
import org.ansj.lucene4.AnsjAnalysis;
import org.ansj.splitWord.analysis.NlpAnalysis;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.RAMDirectory;
import org.apache.lucene.util.Version;
import org.junit.After;
import org.junit.AfterClass;
import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;

/**
 *
 * @author changzhenghe
 */
public class IcdDiseaseDaoImplTest {
    
    ApplicationContext context = new FileSystemXmlApplicationContext("file:/Users/changzhenghe/NetBeansProjects/webAppICD/web/WEB-INF/applicationContext.xml");
    
    
    public IcdDiseaseDaoImplTest() {
    }
    
    @BeforeClass
    public static void setUpClass() {
    }
    
    @AfterClass
    public static void tearDownClass() {
    }
    
   
    
    @After
    public void tearDown() {
    }

    @Test
    public  void firstStepTest() throws IOException {
        MemoryGrid g = (MemoryGrid) context.getBean("grid");
        
        g.searchDiagName("易复性腹股沟疝（右侧）");
        
        /*
        
        try {
            OracleDataSource ods = new OracleDataSource();
            ods.setURL("jdbc:oracle:thin:@//10.6.66.15:1521/QuickHIS");
            ods.setUser("oracle");
            ods.setPassword("quickhis");
            
            Connection conn = ods.getConnection();
            String sql = "select main_icd,diag_name from fir_out_diag_tab where diag_date > (sysdate-1000) and rownum < 100";
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
            
            while (rs.next()) {
                String mainIcd = rs.getString(1);
                String diagName = rs.getString(2);
                System.err.println(" ICD_CODE:"+mainIcd+"\t >>"+diagName);
                if (!g.RootContentHit(diagName)) {
                    System.err.println("\t\t No Root Content Hit!!  Why??");
                }
            }
            
            rs.close();
            stmt.close();
            conn.close();
        } catch (SQLException ex) {
            Logger.getLogger(IcdDiseaseDaoImplTest.class.getName()).log(Level.SEVERE, null, ex);
        }
        */
    }
}
