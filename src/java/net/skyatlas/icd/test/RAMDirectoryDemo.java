/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.test;

import java.io.IOException;
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

/**
 *
 * @author changzhenghe
 */
public class RAMDirectoryDemo {
    public  static  void main(String[] args) throws IOException {
        long startTime = System.currentTimeMillis();
        System.err.println("*************************** 开始检索 ****************************");
        RAMDirectory directory = new RAMDirectory();
        
        Version matchVersion = Version.LUCENE_48; 
        
        Analyzer analyzer = new StandardAnalyzer(matchVersion);
        IndexWriterConfig iwc = new IndexWriterConfig(Version.LUCENE_48, analyzer);
        iwc.setOpenMode(IndexWriterConfig.OpenMode.CREATE);
        IndexWriter writer = new IndexWriter(directory,iwc);
        
        Document doc = new Document();
        doc.add(new Field("name", "Chenghui", Field.Store.YES,Field.Index.ANALYZED));  
        doc.add(new Field("sex", "男的", Field.Store.YES,Field.Index.NOT_ANALYZED));  
        doc.add(new Field("dosometing", "I am learning lucene ",Field.Store.YES, Field.Index.ANALYZED)); 
        
        writer.addDocument(doc);  
        writer.close();
        
        IndexReader reader = DirectoryReader.open(directory);
        IndexSearcher searcher = new IndexSearcher(reader); 
        
        Query query = new TermQuery(new Term("dosometing", "lucene")); 
        
        
        TopDocs rs = searcher.search(query, null, 10);  
        long endTime = System.currentTimeMillis();  
        System.out.println("总共花费" + (endTime - startTime) + "毫秒，检索到" + rs.totalHits + "条记录。");  
        
        for (int i = 0; i < rs.scoreDocs.length; i++) {  
            // rs.scoreDocs[i].doc 是获取索引中的标志位id, 从0开始记录  
            Document firstHit = searcher.doc(rs.scoreDocs[i].doc);  
            System.out.println("name:" + firstHit.getField("name").stringValue());  
            System.out.println("sex:" + firstHit.getField("sex").stringValue());  
            System.out.println("dosomething:" + firstHit.getField("dosometing").stringValue());  
        }  
        reader.close();  
        directory.close();  
        System.out.println("*****************检索结束**********************");  
    }
}
