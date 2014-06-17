/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package net.skyatlas.icd.util;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.StringReader;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.ResourceBundle;
import java.util.Stack;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import love.cq.util.IOUtil;
import net.skyatlas.icd.dao.IcdDiseaseDao;
import net.skyatlas.icd.dao.IcdDiseaseRelationDao;
import net.skyatlas.icd.domain.IcdDisease;
import net.skyatlas.icd.domain.IcdDiseaseIndex;
import net.skyatlas.icd.domain.IcdDiseaseRelation;
import net.skyatlas.icd.util.parseTree.ParseTreeOperatorEnum;
import net.skyatlas.icd.util.parseTree.ParseTreeOperatorNode;
import net.skyatlas.icd.util.parseTree.ParseTreeResultNode;
import oracle.jdbc.pool.OracleDataSource;
import org.ansj.lucene4.AnsjAnalysis;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.BooleanClause;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.Sort;
import org.apache.lucene.search.SortField;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.search.highlight.Highlighter;
import org.apache.lucene.search.highlight.InvalidTokenOffsetsException;
import org.apache.lucene.search.highlight.QueryScorer;
import org.apache.lucene.search.highlight.SimpleHTMLFormatter;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.RAMDirectory;
import org.apache.lucene.util.Version;

/**
 *
 * @author changzhenghe
 */
public class MemoryGrid {

    private boolean dealAlias = false;                // 是否处理别名
    private IcdDiseaseDao dao;
    private IcdDiseaseRelationDao icdDisRelationDao;
    
    private List<IcdDiseaseIndex> allIndexItems;                  // Vol3 的所有条目
    private List<IcdDiseaseIndex> allRootIndexItems;              // 主导词 条目
    private List<IcdDisease> allDiseases;                    // Vol1 所有条目
    private List<IcdDiseaseRelation> allDisRelations;        //Vol1 关系的 所有条目

    // index
    /*
     卷3 的 ID 索引
     */
    private HashMap<Integer, IcdDiseaseIndex> vol3IDIndexedItems = new HashMap();
    
    /*
     卷1 的 ID 索引
     */
    private HashMap<Integer, IcdDisease> vol1IDIndexedItems = new HashMap();
    
    /**
     * 卷1 Relation的 ID索引 
     */
    private HashMap<Integer,IcdDiseaseRelation> vol1IDRelationIndexedItems = new HashMap();
    /**
     * 卷1 Relation的 mainID索引
     */
    private HashMap<Integer,List<IcdDiseaseRelation>> vol1mainIDRelationIndexedItems = new HashMap();
    /*
     卷3 的 名称 索引
     */
    private HashMap<String, List<IcdDiseaseIndex>> vol3NameIndexedItems = new HashMap();       // nameCh

    /*
     卷3 的 拼音 索引
     */
    private HashMap<String, List<IcdDiseaseIndex>> vol3PinYinIndexedItems = new HashMap();     // py

    /*
     卷1 的 名称 索引
     */
    private HashMap<String, List<IcdDisease>> vol1NameIndexedItems = new HashMap();       // codeNameCh
    /*
     卷1 的 拼音 索引
     */
    private HashMap<String, List<IcdDisease>> vol1PinYinIndexedItems = new HashMap();     // py
    /*
     卷1 的 ICDCODE 索引
     */
    private HashMap<String, List<IcdDisease>> vol1IcdIndexedItems = new HashMap();        // icdCode

    /*
     基于卷3 的 搜索路径
     */
    private List<SearchPath> allSearchPaths = new ArrayList();

    //private HashMap<IcdDiseaseIndex, List<SearchPath>> rootIndexedSearchPaths = new HashMap();       // 主导词索引的搜索路径
    private HashMap<IcdDiseaseIndex,SearchPath> rootIndexedSearchPaths = new HashMap();
            
    private HashMap<String, List<SearchPath>> icdIndexedSearchPaths = new HashMap();              // ICD Code索引的搜索路径
    
    private HashMap<String, SearchPath> guidIndexedSearchPaths = new HashMap();                     // 搜索路径 基于 GUID 的索引

    public HashMap<String, SearchPath> getGuidIndexedSearchPaths() {
        return guidIndexedSearchPaths;
    }

    public void setGuidIndexedSearchPaths(HashMap<String, SearchPath> guidIndexedSearchPaths) {
        this.guidIndexedSearchPaths = guidIndexedSearchPaths;
    }

    public HashMap<IcdDiseaseIndex, SearchPath> getRootIndexedSearchPaths() {
        return rootIndexedSearchPaths;
    }

    public void setRootIndexedSearchPaths(HashMap<IcdDiseaseIndex, SearchPath> rootIndexedSearchPaths) {
        this.rootIndexedSearchPaths = rootIndexedSearchPaths;
    }
 

    public List<IcdDiseaseRelation> getAllDisRelations() {
        return allDisRelations;
    }

    public void setAllDisRelations(List<IcdDiseaseRelation> allDisRelations) {
        this.allDisRelations = allDisRelations;
    }

    public IcdDiseaseRelationDao getIcdDisRelationDao() {
        return icdDisRelationDao;
    }

    public void setIcdDisRelationDao(IcdDiseaseRelationDao icdDisRelationDao) {
        this.icdDisRelationDao = icdDisRelationDao;
    }

    public HashMap<Integer, IcdDiseaseRelation> getVol1IDRelationIndexedItems() {
        return vol1IDRelationIndexedItems;
    }

    public void setVol1IDRelationIndexedItems(HashMap<Integer, IcdDiseaseRelation> vol1IDRelationIndexedItems) {
        this.vol1IDRelationIndexedItems = vol1IDRelationIndexedItems;
    }

    public HashMap<Integer, List<IcdDiseaseRelation>> getVol1mainIDRelationIndexedItems() {
        return vol1mainIDRelationIndexedItems;
    }

    public void setVol1mainIDRelationIndexedItems(HashMap<Integer, List<IcdDiseaseRelation>> vol1mainIDRelationIndexedItems) {
        this.vol1mainIDRelationIndexedItems = vol1mainIDRelationIndexedItems;
    }
 
    

    public List<SearchPath> getAllSearchPaths() {
        return allSearchPaths;
    }

    public void setAllSearchPaths(List<SearchPath> allSearchPaths) {
        this.allSearchPaths = allSearchPaths;
    }

 /*   public HashMap<IcdDiseaseIndex, List<SearchPath>> getRootIndexedSearchPaths() {
        return rootIndexedSearchPaths;
    }

    public void setRootIndexedSearchPaths(HashMap<IcdDiseaseIndex, List<SearchPath>> rootIndexedSearchPaths) {
        this.rootIndexedSearchPaths = rootIndexedSearchPaths;
    }
*/
    public HashMap<String, List<SearchPath>> getIcdIndexedSearchPaths() {
        return icdIndexedSearchPaths;
    }

    public void setIcdIndexedSearchPaths(HashMap<String, List<SearchPath>> icdIndexedSearchPaths) {
        this.icdIndexedSearchPaths = icdIndexedSearchPaths;
    }

    public boolean isDealAlias() {
        return dealAlias;
    }

    public void setDealAlias(boolean dealAlias) {
        this.dealAlias = dealAlias;
    }

    public IcdDiseaseDao getDao() {
        return dao;
    }

    public void setDao(IcdDiseaseDao dao) {
        this.dao = dao;
    }

    public List<IcdDiseaseIndex> getAllIndexItems() {
        return allIndexItems;
    }

    public void setAllIndexItems(List<IcdDiseaseIndex> allIndexItems) {
        this.allIndexItems = allIndexItems;
    }

    public List<IcdDiseaseIndex> getAllRootIndexItems() {
        return allRootIndexItems;
    }

    public void setAllRootIndexItems(List<IcdDiseaseIndex> allRootIndexItems) {
        this.allRootIndexItems = allRootIndexItems;
    }

    public List<IcdDisease> getAllDiseases() {
        return allDiseases;
    }

    public void setAllDiseases(List<IcdDisease> allDiseases) {
        this.allDiseases = allDiseases;
    }

    public HashMap<Integer, IcdDiseaseIndex> getVol3IDIndexedItems() {
        return vol3IDIndexedItems;
    }

    public void setVol3IDIndexedItems(HashMap<Integer, IcdDiseaseIndex> vol3IDIndexedItems) {
        this.vol3IDIndexedItems = vol3IDIndexedItems;
    }

    public HashMap<Integer, IcdDisease> getVol1IDIndexedItems() {
        return vol1IDIndexedItems;
    }

    public void setVol1IDIndexedItems(HashMap<Integer, IcdDisease> vol1IDIndexedItems) {
        this.vol1IDIndexedItems = vol1IDIndexedItems;
    }

    public HashMap<String, List<IcdDiseaseIndex>> getVol3NameIndexedItems() {
        return vol3NameIndexedItems;
    }

    public void setVol3NameIndexedItems(HashMap<String, List<IcdDiseaseIndex>> vol3NameIndexedItems) {
        this.vol3NameIndexedItems = vol3NameIndexedItems;
    }

    public HashMap<String, List<IcdDiseaseIndex>> getVol3PinYinIndexedItems() {
        return vol3PinYinIndexedItems;
    }

    public void setVol3PinYinIndexedItems(HashMap<String, List<IcdDiseaseIndex>> vol3PinYinIndexedItems) {
        this.vol3PinYinIndexedItems = vol3PinYinIndexedItems;
    }

    public HashMap<String, List<IcdDisease>> getVol1NameIndexedItems() {
        return vol1NameIndexedItems;
    }

    public void setVol1NameIndexedItems(HashMap<String, List<IcdDisease>> vol1NameIndexedItems) {
        this.vol1NameIndexedItems = vol1NameIndexedItems;
    }

    public HashMap<String, List<IcdDisease>> getVol1PinYinIndexedItems() {
        return vol1PinYinIndexedItems;
    }

    public void setVol1PinYinIndexedItems(HashMap<String, List<IcdDisease>> vol1PinYinIndexedItems) {
        this.vol1PinYinIndexedItems = vol1PinYinIndexedItems;
    }

    public HashMap<String, List<IcdDisease>> getVol1IcdIndexedItems() {
        return vol1IcdIndexedItems;
    }

    public void setVol1IcdIndexedItems(HashMap<String, List<IcdDisease>> vol1IcdIndexedItems) {
        this.vol1IcdIndexedItems = vol1IcdIndexedItems;
    }

    // 全文检索
    private RAMDirectory directory;
    private Analyzer analyzer;
    /*
     1. 存在 （） 中嵌套 [] 的情形
     2. 存在[] 中嵌套()的情形
     3. 在[] 中出现 ， (全角)
     */

    private final String pstr1 = "\\([^\\)]+?(\\[.+?\\])";                      // （）中嵌套 []
    private final String pstr2 = "\\[[^\\]]+?\\(";                      // [] 中嵌套()
    private final String pstr3 = "\\[[^\\]]+?，";                       // [] 中出现，
    private final String pstr4 = "(\\([^\\)]+?，.*?\\))";                      // ()中出现，

    public void init() throws IOException, CorruptIndexException, InvalidTokenOffsetsException, ParseException, SQLException {
        System.err.println("--------------\t\t Memory Grid Initializing -------------");
        this.allDiseases = this.dao.getAllDisease();    // 查询所有Vol1 条目
        
        this.allIndexItems = this.dao.getAllDiseaseIndexes();   // 查询所有Vol3 条目
        this.allDisRelations= this.icdDisRelationDao.getAllDiseaseRelation();//查询所有Vol1关系 条目
        // 主导词
        if (this.allRootIndexItems == null) {
            this.allRootIndexItems = new ArrayList();
        }
        System.err.println("All Index Items size:" + allIndexItems.size());
        System.err.println("All Disease Items size:" + allDiseases.size());
        //Vol1 Relation
        for(int i=0;i<this.allDisRelations.size();i++){
            IcdDiseaseRelation r = this.allDisRelations.get(i);
            this.getVol1IDRelationIndexedItems().put(r.getId(), r);
            List<IcdDiseaseRelation> list = this.getVol1mainIDRelationIndexedItems().get(r.getMainID());
            if(list ==null||list.size()==0){
                list = new ArrayList();
                list.add(r);
                this.getVol1mainIDRelationIndexedItems().put(r.getMainID(), list);
            }else{
                list.add(r);
            }
        }
        // Vol 1
        for (int i = 0; i < this.allDiseases.size(); i++) {
            IcdDisease d = this.allDiseases.get(i);
            
            //set Relations
            List<IcdDiseaseRelation> icdDisRelations =new ArrayList();
            icdDisRelations = this.getVol1mainIDRelationIndexedItems().get(d.getId());
            HashMap<String,List<IcdDiseaseRelation>>      refRelations = new HashMap();
            List<IcdDiseaseRelation> noIncludeList = new ArrayList();//d.getRefRelations().get("不包括");
            List<IcdDiseaseRelation> otherCodeList = new ArrayList();//d.getRefRelations().get("另编码");
            List<IcdDiseaseRelation> swordList = new ArrayList();//d.getRefRelations().get("星剑");
            List<IcdDiseaseRelation> includeList = new ArrayList();//d.getRefRelations().get("包括");
            if(icdDisRelations==null||icdDisRelations.size()==0){
            
            }else{
                for(int j=0;j<icdDisRelations.size();j++){
                    IcdDiseaseRelation idr = icdDisRelations.get(j);
                    if(idr.getRelationType().equals("不包括")){
                        noIncludeList.add(idr);
                    }else if(idr.getRelationType().equals("另编码")){
                        otherCodeList.add(idr);
                    }else if(idr.getRelationType().equals("星剑")){
                        swordList.add(idr);
                    }else if(idr.getRelationType().equals("包括")){
                        includeList.add(idr);
                    }
                }
                if(noIncludeList.size()>0){
                    refRelations.put("不包括", noIncludeList);
                }
                if(otherCodeList.size()>0){
                    refRelations.put("另编码", otherCodeList);
                }
                if(swordList.size()>0){
                    refRelations.put("星剑", swordList);
                }
                if(includeList.size()>0){
                    refRelations.put("包括", includeList);
                }
            }
            d.setRefRelations(refRelations);

            // ID Unique Index
            this.getVol1IDIndexedItems().put(d.getId(), d);

//            System.err.println(" 处理 IcdDisease, ICD Code :"+d.getIcdCode());
            // ICD Code 索引
            if (d.getIcdCode() != null && d.getIcdCode().length() > 0) {    // ICD 为空的记录不做索引
                List<IcdDisease> alIndexes;
                if (this.getVol1IcdIndexedItems().containsKey(d.getIcdCode().toUpperCase())) {
                    alIndexes = this.getVol1IcdIndexedItems().get(d.getIcdCode().toUpperCase());
                } else {
                    alIndexes = new ArrayList();
                }
//                System.err.println("Index Disease :"+d.getIcdCode());
                alIndexes.add(d);
                this.getVol1IcdIndexedItems().put(d.getIcdCode().replaceAll("↑$", "").toUpperCase(), alIndexes);
            }
            // Vol1 Name 索引
            List<IcdDisease> alIndexes2;
            if (this.getVol1NameIndexedItems().containsKey(d.getCodeNameCh())) {
                alIndexes2 = this.getVol1NameIndexedItems().get(d.getCodeNameCh());
            } else {
                alIndexes2 = new ArrayList();
            }
            alIndexes2.add(d);
            this.getVol1NameIndexedItems().put(d.getCodeNameCh(), alIndexes2);

            // Vol1 拼音 索引
            List<IcdDisease> alIndexes3;
            if (this.getVol1PinYinIndexedItems().containsKey(d.getPy())) {
                alIndexes3 = this.getVol1PinYinIndexedItems().get(d.getPy());
            } else {
                alIndexes3 = new ArrayList();
            }
            alIndexes3.add(d);
            this.getVol1PinYinIndexedItems().put(d.getPy(), alIndexes3);

        }
        
        /*
            Vol1中建立parent-children 关系
        */
        for (int i = 0; i < this.allDiseases.size(); i++) {
            IcdDisease d = this.allDiseases.get(i);
            if (d.getParentID() != null && d.getParentID() != 0) {
                IcdDisease parent = this.getVol1IDIndexedItems().get(d.getParentID());
                d.setParentDisease(parent);
                if (parent == null)
                {
                    System.err.println(" parent is null :"+d.getId()+"\t"+d.getParentID());
                    continue;
                }
                if (parent.getChildren() == null) {
                    parent.setChildren(new ArrayList());
                }
                parent.getChildren().add(d);
            }
        }
        

        // Vol 3
        for (int i = 0; i < this.allIndexItems.size(); i++) {
            IcdDiseaseIndex e = this.allIndexItems.get(i);
            this.getVol3IDIndexedItems().put(e.getId(), e);         // ID 索引 Unique

            // 名称索引
            List<IcdDiseaseIndex> alIdxes;
            if (this.getVol3NameIndexedItems().containsKey(e.getNameCh())) {
                alIdxes = this.getVol3NameIndexedItems().get(e.getNameCh());
            } else {
                alIdxes = new ArrayList();
            }
            alIdxes.add(e);
            this.getVol3NameIndexedItems().put(e.getNameCh(), alIdxes);

            // 拼音索引
            List<IcdDiseaseIndex> alIdxes2;
            if (this.getVol3PinYinIndexedItems().containsKey(e.getPy())) {
                alIdxes2 = this.getVol3PinYinIndexedItems().get(e.getPy());
            } else {
                alIdxes2 = new ArrayList();
            }
            alIdxes2.add(e);
            this.getVol3PinYinIndexedItems().put(e.getPy(), alIdxes2);

            // 判断是否需要处理别名
            if (this.dealAlias) {
                e.setAliases((String[]) dao.getAliasesByIndexid(e.getId()).toArray());
            }

            if (e.getDepth() == 0) {        // Vol3 Item 主导词
             
                this.allRootIndexItems.add(e);
//                Pattern p = Pattern.compile("[\\[]");
//                Matcher m = p.matcher(e.getNameCh());
//                while (m.find()) {
//                    System.err.println("[]在主导词中匹配:\t"+e.getNameCh()+"-> startIndex:"+m.start()+"-> endIndex:"+m.end()+" Match:"+m.group());
//                }
//                Pattern p2 = Pattern.compile("[性期]\\)");
//                Matcher m2 = p2.matcher(e.getNameCh());
//                while (m2.find()) {
//                    System.err.println("(性、期)在主导词中匹配:\t"+e.getNameCh()+"-> startIndex:"+m2.start()+"-> endIndex:"+m2.end()+" Match:"+m2.group());
//                }

//                p2 = Pattern.compile(pstr1);
//                m2 = p2.matcher(e.getNameCh());
//                while (m2.find()) {
//                    System.err.println(" () 中 嵌套 [] ："+m2.group()+"-->"+e.getNameCh()+"->"+m2.group(1));
//                }
//                
//                p2 = Pattern.compile(pstr2);
//                m2 = p2.matcher(e.getNameCh());
//                while (m2.find()) {
//                    System.err.println(" [] 中 嵌套 () ："+m2.group()+"-->"+e.getNameCh());
//                }
//                
//                
//                p2 = Pattern.compile(pstr3);
//                m2 = p2.matcher(e.getNameCh());
//                while (m2.find()) {
//                    System.err.println(" [] 中 出现逗号 ："+m2.group()+"-->"+e.getNameCh());
//                }
//                
//                
//                p2 = Pattern.compile(pstr4);
//                m2 = p2.matcher(e.getNameCh());
//                while (m2.find()) {
//                    System.err.println(" () 中 出现逗号 ："+m2.group()+"-->"+e.getNameCh());
//                }
//                 对主导词进行解析
           /*
                parseRootIndex(e);
                e.getParseTreeRoot().setDepth(0);
                System.out.println("主导词 " + e.getNameCh() + " \n Parse Result :" + e.getParseTreeRoot().toString());
                
                */
            }
            // 主导词处理结束

        }

        // 建立搜索路径 Vol3
        for (IcdDiseaseIndex idi : this.allIndexItems) {
            // ICD 不为空的，建立搜索路径
            if (idi.getIcdCode() != null && idi.getIcdCode().length() > 0) {
                Stack<IcdDiseaseIndex> v = new Stack();
                createIdexSearchPath(v, idi);

                // 存储搜索路径
                SearchPath path = new SearchPath();
                Iterator<IcdDiseaseIndex> itr = v.iterator();
                while (itr.hasNext()) {
                    IcdDiseaseIndex i = itr.next();
                    path.getNodeList().add(i);

                    // 对 IcdDiseaseIndex 进行Parse
                    if (idi.getDepth() > 0) {
                        /*
                        parseRootIndex(idi);
                        */
                    }
                }
                path.setNodes(path.getNodeList().size());
                path.setStartPoint(path.getNodeList().get(0));

                // Get Terminal ICD Disease
                /*
                 M72.5   Vol1  不存在
                 D54     Vol1  不存在
                 W13     Vol1  没有记录
                 */
                
                List<IcdDisease> ds = this.getVol1IcdIndexedItems().get(idi.getIcdCode().replaceAll("↑$", "").toUpperCase());
                if (ds == null) {   // Maybe the icd code in Vol3 cannot be found in Vol1, Skip this item...
                    ds = this.getVol1IcdIndexedItems().get(idi.getIcdCode().replaceAll("↑$", "").replaceAll("\\.—$", "").replace(".-", "").toUpperCase());
                    if (ds == null) {
                        System.err.println("ICD CODE:" + idi.getIcdCode() + " Indexed ?" + this.getVol1IcdIndexedItems().containsKey(idi.getIcdCode().toUpperCase()) + "--" + idi.getIcdCode().replaceAll("↑$", "").replaceAll("\\.—$", "").replace(".-", "").toUpperCase());
                        continue;
                    }

                }
                for (IcdDisease dis : ds) {
                    if (dis.getCodeType().equals("章") || dis.getCodeType().equals("节")) {
                        continue;
                    }
                    path.setTerminal(dis);
                }

                // 设置 章、节、类目、亚目
                setDimension(path, path.getTerminal());

                // 存储
                this.getAllSearchPaths().add(path);
                
                this.getGuidIndexedSearchPaths().put(path.getPathHashCode(), path);

                // 根据最终指向的ICD Code，进行索引
                List<SearchPath> al1 = this.getIcdIndexedSearchPaths().get(path.getTerminal().getIcdCode().toUpperCase());
                if (al1 == null) {
                    al1 = new ArrayList<SearchPath>();
                }
                al1.add(path);
                this.getIcdIndexedSearchPaths().put(path.getTerminal().getIcdCode().toUpperCase(), al1);

                // 根据主导词(ICDDiseaseIndex)对象进行索引
               // List<SearchPath> al2 = this.getRootIndexedSearchPaths().get(path.getStartPoint());
                SearchPath al2 = this.getRootIndexedSearchPaths().get(path.getStartPoint());
                if (al2 == null) {
                    al2 = new SearchPath();
                }
                al2 = path;
                this.getRootIndexedSearchPaths().put(path.getStartPoint(), al2);

            }
        }
        /*2014-06-11 15:28:22
         *  Vol3中建立parent-children 关系
         */
        for(int i =0;i<this.allIndexItems.size();i++){
            IcdDiseaseIndex d = this.allIndexItems.get(i);
            if(d.getParentID()!=null&&d.getParentID()!=0){
                IcdDiseaseIndex parent = this.getVol3IDIndexedItems().get(d.getParentID());
                d.setParentDiseaseIndex(parent);
                if(parent == null){
                    System.err.println(" parent is null :"+d.getId()+"\t"+d.getParentID());
                    continue;
                }
                if(parent.getChildren() ==null){
                    parent.setChildren(new ArrayList());
                }
                parent.getChildren().add(d);
            }
        }
        // 建立搜索路径 End!
        
        /*
            目前存在问题:
                1.   ICDDisease 对象没有自动包含 children   --> 做了改善，效果如何，待检测
                2.   ICDDisease 没有参与创建Lucene 索引     --> 已参与索引
                3.   索引创建，search  都还处于未加工状态……
        
        */

        System.err.println("Search Path #:"+this.getAllSearchPaths().size());
        System.err.println("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
//        for (SearchPath sp : this.getAllSearchPaths()) {
//            System.err.println(sp);
//        }
        System.err.println("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        /*
        for (IcdDiseaseIndex idi : this.allRootIndexItems) {
            System.err.println("主导词 :" + idi.getNameCh() + "->" + idi.getPage() + "-" + idi.getPathStr() + "-" + idi.getDepth());
            List<SearchPath> paths = this.getRootIndexedSearchPaths().get(idi);
            if (paths == null) {
                System.err.println("\t 没有对应的Search Path。");
            } else {
                for (SearchPath sp : paths) {
                System.err.println("\t 路径："+sp.getIndexString());
                }
            }

        }
        */

        
        

        System.err.println("******************* Begin create Idnex *********************");
        HashSet<String> hs = new HashSet<String>();
        BufferedReader reader2 = IOUtil.getReader(ResourceBundle.getBundle("library").getString("stopLibrary"), "UTF-8");
        String word = null;
        while ((word = reader2.readLine()) != null) {
            hs.add(word);
        }
        
        // 实例化 MemoryGrid 的两个 Lucene 相关变量
        directory = new RAMDirectory();
        Version matchVersion = Version.LUCENE_48;
        analyzer = new AnsjAnalysis(hs, false);
       
        
        /*
        TokenStream ts = analyzer.tokenStream("", "巴贝虫病");
//        CharTermAttribute term = ts.addAttribute(CharTermAttribute.class);

        System.err.println(" Test 巴贝虫病");
        while (ts.incrementToken()) {
            System.out.println("【" + ts.getAttribute(CharTermAttribute.class) + "】");
        }
        ts.close();
        */
        
        IndexWriterConfig iwc = new IndexWriterConfig(Version.LUCENE_48, analyzer);
        iwc.setOpenMode(IndexWriterConfig.OpenMode.CREATE);
        IndexWriter writer = new IndexWriter(directory, iwc);

        // 生成索引
        for (SearchPath path : this.getAllSearchPaths()) {
//            System.err.println(" 为搜索路径建立索引 :"+path.getIndexString());
            addContent(writer,path.getIndexString(),path.getPathHashCode(),path.getNodes(),"vol3");

        }


        writer.commit();
        writer.close();

        System.err.println("***************** index created *******************");

        System.out.println("索引建立完毕");

//        search(analyzer,directory,"巴贝虫病");
        
        //DEBUG:   从HIS数据库中获取 医生诊断、ICD编码信息，教研检索结果
        
        /*
        try {
            OracleDataSource ods = new OracleDataSource();
            ods.setURL("jdbc:oracle:thin:@//192.168.1.115:1521/omac");
            ods.setUser("oracle");
            ods.setPassword("quickhis");
            
            Connection conn = ods.getConnection();
            String sql = "select main_icd,diag_name from fir_out_diag_tab where diag_date > (sysdate-1000) and rownum < 1000";
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
            
            while (rs.next()) {
                String mainIcd = rs.getString(1);
                String diagName = rs.getString(2);
                if (diagName==null || "".equals(diagName)) {
                    continue;
                }
                diagName = diagName.replaceAll("（", "(").replaceAll("）", ")");
                System.err.println(" ICD_CODE:"+mainIcd+"\t >>"+diagName);
                search(analyzer,directory,diagName);
            }
            
            rs.close();
            stmt.close();
            conn.close();
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        
        */
    }

    private void search(Analyzer analyzer, Directory directory, String queryStr) throws CorruptIndexException, IOException, ParseException, InvalidTokenOffsetsException {
        IndexSearcher isearcher;
        IndexReader reader = DirectoryReader.open(directory);
        // 查询索引
        
        isearcher = new IndexSearcher(reader);
        QueryParser tq = new QueryParser(Version.LUCENE_32, "text", ansjHeightAnalyzer);
        
        // 根据 搜索路径 深度， 做降序排列
        try {
//            Sort sort = new Sort(new SortField[] {new SortField("nodes", SortField.Type.INT, true) });
            Query query = tq.parse(queryStr);
            System.err.println(query);
            TopDocs hits = isearcher.search(query, 6);
            System.err.println(queryStr + ":共找到" + hits.totalHits + "条记录!");
            for (int i = 0; i < hits.scoreDocs.length; i++) {
                int docId = hits.scoreDocs[i].doc;
                Document document = isearcher.doc(docId);
                String guid = document.get("guid");
                String icdCode = null;
                if (this.getGuidIndexedSearchPaths().get(guid).getTerminal()!=null) {
                    icdCode = this.getGuidIndexedSearchPaths().get(guid).getTerminal().getIcdCode();
                }
                System.err.println("GUID : "+guid+" ICD_CODE:" + icdCode + "\t\t"+toHighlighter(ansjHeightAnalyzer, query, document));
            }
        }
        catch(ParseException pe) {
            pe.printStackTrace();
        }
    }
    
    private IndexSearcher isearcher;
    
    private IndexSearcher   getSearcherInstance() throws IOException {
        if (this.isearcher != null) {
            return this.isearcher;
        }
        else {
            IndexReader reader = DirectoryReader.open(this.directory);
            // 查询索引
        
            isearcher = new IndexSearcher(reader);
        }
        return this.isearcher;
    }
    
    // 对外服务接口
    public  List<SearchPathShowObj>    searchSvc(String diagName) throws IOException, InvalidTokenOffsetsException {
        List<SearchPathShowObj> result = new ArrayList();
        if (this.directory == null || this.analyzer == null) {
            throw new RuntimeException("Lucene 初始化异常，自动编码功能不可用");
        }
        
        long beginTime = System.currentTimeMillis();
        // 临时处理，删除 特殊符号
        diagName = diagName.replaceAll("（", "(").replaceAll("）", ")").replaceAll("\\(.*?\\)", "").replace("*", "").replace("?", "");
//        IndexSearcher isearcher;
        isearcher = getSearcherInstance();
        
        QueryParser tq = new QueryParser(Version.LUCENE_48, "text", ansjHeightAnalyzer);
//        tq.setDefaultOperator(QueryParser.Operator.AND);
        // 根据 搜索路径 深度， 做降序排列
        try {
//            Sort sort = new Sort(new SortField[] {new SortField("nodes", SortField.Type.INT, true) });
            Query query = tq.parse(diagName);
            System.err.println(query);
            TopDocs hits = isearcher.search(query, 6);
            System.err.println(diagName + ":共找到" + hits.totalHits + "条记录!");
            for (int i = 0; i < hits.scoreDocs.length; i++) {
                int docId = hits.scoreDocs[i].doc;
                Document document = isearcher.doc(docId);
                String guid = document.get("guid");
                result.add(new SearchPathShowObj(this.getGuidIndexedSearchPaths().get(guid)));
//                String icdCode = null;
//                if (this.getGuidIndexedSearchPaths().get(guid).getTerminal()!=null) {
//                    icdCode = this.getGuidIndexedSearchPaths().get(guid).getTerminal().getIcdCode();
//                }
//               System.err.println("GUID : "+guid+" ICD_CODE:" + icdCode + "\t\t"+toHighlighter(ansjHeightAnalyzer, query, document));
            }
        }
        catch(ParseException pe) {
            pe.printStackTrace();
        }
        long responseTime = System.currentTimeMillis() - beginTime;
        System.err.println(" 为 "+diagName + " 编码，花费"+responseTime+"ms.");
        return result;
    }
    public List<SearchPath> searchSvc(String name,String type) throws IOException{
        List<SearchPath> result = new ArrayList();
        if (this.directory == null || this.analyzer == null) {
            throw new RuntimeException("Lucene 初始化异常，自动编码功能不可用");
        }
        long beginTime = System.currentTimeMillis();
        // 临时处理，删除 特殊符号
        name = name.replaceAll("（", "(").replaceAll("）", ")").replaceAll("\\(.*?\\)", "").replace("*", "").replace("?", "");
 
        isearcher = getSearcherInstance();
        
        QueryParser tq = new QueryParser(Version.LUCENE_48, "text", ansjHeightAnalyzer);
     
        String queryStr="(text:'"+name+"') (type:'"+type+"')" ;
       
        // 根据 搜索路径 深度， 做降序排列
        try {
//           
            Query query = tq.parse(queryStr);
            
            System.err.println(query );
        
           TopDocs hits = isearcher.search(query, 6);
            System.err.println(name + ":共找到" + hits.totalHits + "条记录!");
             
            HashMap<String,SearchPath> listSp = new HashMap();  ;
            for(int i=0;i<hits.scoreDocs.length ;i++){
                int docID = hits.scoreDocs[i].doc;
                Document document = isearcher.doc(docID);
                String text = document.get("text");
                String guid = document.get("guid");
                String nodes = document.get("nodes");
                String stype = document.get("type");
                 SearchPath sp = this.getGuidIndexedSearchPaths().get(guid);
                System.err.println("!!!! text:"+text+"||guid:"+guid+"||nodes:"+nodes+"||type:"+stype+"||icdCode:"+sp.getStartPoint().getIcdCode());
               
                if(listSp.get(sp.getStartPoint().getIcdCode())!=null){
                    
                }else{
                    listSp.put(sp.getStartPoint().getIcdCode(), sp);
                    System.err.println("   --> text:"+text+"||guid:"+guid+"||nodes:"+nodes+"||type:"+stype+"||icdCode:"+sp.getStartPoint().getIcdCode());
                    result.add(sp);
                }
                
            }
        }
        catch(ParseException pe) {
            pe.printStackTrace();
        }
        long responseTime = System.currentTimeMillis() - beginTime;
        System.err.println(" 为 "+name + " 编码，花费"+responseTime+"ms.");
        return result;
    }

    // 设置 章、节、类目、亚目
    private void setDimension(SearchPath path, IcdDisease d) {
        String codeType = d.getCodeType();
        if (codeType.equals("章")) {
            path.setChapter(d.getIcdCode().toUpperCase());
        } else if (codeType.equals("节")) {
            path.setSection(d.getIcdCode().toUpperCase());
        } else if (codeType.equals("类目")) {
            path.setClazz(d.getIcdCode().toUpperCase());
        } else if (codeType.equals("亚目")) {
            path.setSubclazz(d.getIcdCode().toUpperCase());
        }
        if (d.getParentID() != null) {
            IcdDisease pd = this.getVol1IDIndexedItems().get(d.getParentID());
            if (pd != null) {
                setDimension(path, pd);
            }
        }
    }

    // 由下向上建立搜索路径
    private void createIdexSearchPath(Stack v, IcdDiseaseIndex idi) {
        
        if (idi.getParentID() != null) {
            IcdDiseaseIndex parent = this.getVol3IDIndexedItems().get(idi.getParentID());
            if (parent != null) {
                createIdexSearchPath(v, parent);
            }
            
        }
        v.push(idi);        // 顺序不能颠倒
    }

    /*
     对 Vol3 中 主导词条目进行解析，产生 ParseTree 用户后续判断诊断是否匹配主导词
     */
    public void parseRootIndex(IcdDiseaseIndex item) {
        String source = item.getNameCh();           // 主导词 string
        ParseTreeResultNode rootNode = new ParseTreeResultNode();
        rootNode.setContent(null);
        rootNode.setDepth(0);       // root node

        ParseTreeOperatorNode orOper = new ParseTreeOperatorNode();
        orOper.setDepth(1);
        orOper.setOperator(ParseTreeOperatorEnum.LOGIC_OR);
        orOper.setSubResults(new ArrayList());

        if (this.dealAlias) {       // 需要处理别名
            for (String alias : item.getAliases()) {    // 所有alias 作为 OR 操作的元素
                if (alias == null || alias.length() == 0) {
                    continue;
                }
                ParseTreeResultNode n = new ParseTreeResultNode();
                n.setContent(alias);
                n.setDepth(2);
                orOper.getSubResults().add(n);
            }
        }
        // 对 主导词字符串做的解析，作为 OR 操作的元素添加
        orOper.getSubResults().add(parseIndexContent(source, 2));

        rootNode.setOperNode(orOper);
        item.setParseTreeRoot(rootNode);
    }

    private static final HashMap<String, String[]> reverseWords = new HashMap();

    static {
        // .*性
        reverseWords.put("先天", new String[]{"后天"});
        reverseWords.put("良性", new String[]{"恶性"});
        reverseWords.put("干", new String[]{"湿"});
        reverseWords.put("慢", new String[]{"急", "亚急"});    // 急性  慢性  亚急性
        reverseWords.put("持续", new String[]{"间断"});
        reverseWords.put("急", new String[]{"亚急", "慢"});

        //reverse
        reverseWords.put("后天", new String[]{"先天"});
        reverseWords.put("恶性", new String[]{"良性"});
        reverseWords.put("湿", new String[]{"干"});

        reverseWords.put("间断", new String[]{"持续"});
        reverseWords.put("亚急", new String[]{"慢", "急"});

    }

    /*
    
     61003 ocr错误
     59809
     61229
     58607
    
     ***综合征  --》 *** && 综合征
     */
    // 处理主导词元素 需要 进行 AND操作 [\\-(\\(.+?\\)+)]
    /*
     根据传入的主导词元素， 解析 返回 AND 连接后的一个 ResultNode
     可能多次调用
     设想： 先进行OR分解，OR分解出来的子元素，再进行AND分解
     */
    private ParseTreeResultNode andRecursiveFunc(String item, int beginDepth) {
        // AND 分解
        // [奥尔德里奇(-威斯科特)综合征]   -->  奥尔德里奇 && 综合征
        // [湿疹-血小板减少-免疫缺陷综合征]  --> 湿疹 && 血小板减少 && 免疫缺陷综合征
//        System.err.println("\t\tandRecursiveFunc 调用开始:"+item);
        String[] subitems = null;
        ParseTreeResultNode orNode = new ParseTreeResultNode();
        subitems = item.split("[\\-(\\(.+?\\)+)—]");        // 两种 短横线  ()
        if (subitems.length > 1) {
//           System.err.println("\t\tandRecursiveFunc 发现多个 AND 条件");
            orNode.setDepth(beginDepth + 1);
            ParseTreeOperatorNode oper = new ParseTreeOperatorNode();
            oper.setDepth(beginDepth + 2);
            oper.setOperator(ParseTreeOperatorEnum.LOGIC_AND);
            if (oper.getSubResults() == null) {
                oper.setSubResults(new ArrayList());
            }
            for (String subitem : subitems) {
//                System.err.println("\t\t\t处理 AND 条件 :"+subitem);
                if (subitem == null || subitem.length() == 0) {
                    continue;
                }
                ParseTreeResultNode n = new ParseTreeResultNode();
                n.setContent(subitem);
                n.setContentOper(ParseTreeOperatorEnum.MATCH);
                n.setDepth(beginDepth + 3);
                oper.getSubResults().add(n);
            }
            orNode.setOperNode(oper);

        } else {
//           System.err.println("\t\tandRecursiveFunc 仅有一个 AND 条件"); 
            if (item != null && item.length() > 0) {
                orNode.setContent(item);
                orNode.setContentOper(ParseTreeOperatorEnum.MATCH);
                orNode.setDepth(beginDepth + 1);
            }

        }
        return orNode;
    }

    private ParseTreeResultNode orRecursiveFunc(String item, int beginDepth) {
        String[] subitems = null;
        ParseTreeResultNode resultnode = new ParseTreeResultNode();
        // ， 分隔， OR
        subitems = item.split("[，或、]");
        if (subitems.length >= 1) {

            resultnode.setDepth(beginDepth + 1);
            ParseTreeOperatorNode oper = new ParseTreeOperatorNode();
            oper.setDepth(beginDepth + 2);
            oper.setOperator(ParseTreeOperatorEnum.LOGIC_OR);
            if (oper.getSubResults() == null) {
                oper.setSubResults(new ArrayList());
            }

            for (String subitem : subitems) {
//                System.err.println("\t DEBUG( 发现[],OR 分隔符处理, content):"+subitem);
                if (subitem == null || subitem.length() == 0) {
                    continue;
                }
                ParseTreeResultNode n = andRecursiveFunc(subitem, beginDepth);

                oper.getSubResults().add(n);
            }
            resultnode.setOperNode(oper);

        }

        //埃及巨脾病,白塞病或综合征[生殖器溃疡、口疮及葡萄膜炎]
        //脊椎缺损、肛门闭锁、气管食管瘘、桡骨及肾脏发育异常综合征
        // 对于 “及” 没有很好的处理方法
        return resultnode;
    }

    /* 
     拆解 病或综合征 类型输入
     */
    private String prepareSemanticSplit(String item) {
        String[] patterns = {
            "(.+?)(癔症)、(神经症)或(反应)$",
            "(.+?)(异常)、(病)或(综合征)$",
            "(.+?)(病)、(综台征)或(尿道炎)$",
            "(.+?)(病)或(综合征)$",
            "(.+?)(综合征)或(病)$",
            "(.+?)(现象)或(反应)$",
            "(.+?)(现象)、(瞳孔)或(综合征)",
            "(.+?)(瞳孔)或(综合征)$",
            "(.+?)(硬化)、(变性)、(病)或(硬化)$",
            "(.+?)(病)、(麻痹)或(综合征)$",
            "(.+?)(障碍)、(缺乏)或(丧失)$",
            "(.+?)(病)、(综合征)或(震颤)$",
            "(.+?)(病)或(硬化)$",
            "(.+?)(皮炎)或(病)$",
            "(.+?)(麻痹)或(综合征)$",
            "(.+?)(痴呆)或(病)$",
            "(.+?)(病)或(感觉异常)$",
            "(.+?)(贫血)或(综合征)$",
            "(.+?)(困难)或(失败)$",
            "(.+?)(病)或(神经病)$",
            "(.+?)(挛缩)或(麻痹)$",
            "(.+?)(休克)或(反应)$",
            "(.+?)(小体)或(疣)$",
            "(.+?)(病)或(结节)$",
            "(.+?)(病)或(舞蹈征)$",
            "(.+?)(癫痫)或(发作)$",
            "(.+?)(膜)或(帆)$",
            "(.+?)(综合征)或(复征)$",
            "(.+?)(情节)或(反应)$",
            "(.+?)(综合征)或(瘫痪)$",
            "(.+?)(感染)或(侵染)$",
            "(.+?)(并发症)或(反应)$",
            "(.+?)(异常)或(综合征)$",
            "(.+?)(麻痹)或(压缩)$",
            "(.+?)(骨折)或(撕裂)$",
            "(.+?)(胎儿)或(新生儿)$",
            "(.+?)(病)或(癫痫)$",
            "(.+?)(贫血)或(病)$",
            "(.+?)(危象)或(反应)$",
            "(.+?)(晚期效应)或(后遗症)$",
            "(.+?)(咬伤)或(抓伤)$",
            "(.+?)(毒素)或(疫苗)$",
            "(.+?)(肉瘤)或(瘤)$",
            "(.+?)(梗阻)或(综合征)$",
            "(.+?)(肝硬变)或(病)$",
            "(.+?)(困难)或(失败)$",
            "(.+?)(骨质疏松)及(萎缩)$",};

        // 处理现译名 
        item = item.replaceAll("(.)[现曾]译名", "或");

        Pattern specpattern = Pattern.compile("\\[又译名(.+?)\\]");
        Matcher specmatcher = specpattern.matcher(item);
        if (specmatcher.find()) {
            item = item.replaceAll("\\[又译名(.+?)\\]", "[" + specmatcher.group(1) + "]");
        }
        item = item.replaceAll(".?又译名", "或");

//        System.err.println(" 处理完 译名 :"+item);
        specpattern = Pattern.compile("(.+?)病或综合征$");
        specmatcher = specpattern.matcher(item);
        if (specmatcher.find()) {
            item = specmatcher.group(1) + "病或" + specmatcher.group(1) + "综合征";
        }

        for (int x = 0; x < patterns.length; x++) {

            String p = patterns[x];
//            System.err.println("\t\t pattern :"+p);
            // 针对预先定义的pattern，进行匹配操作，进行语义拆解
            specpattern = Pattern.compile(p);
            specmatcher = specpattern.matcher(item);
            while (specmatcher.find()) {
//                System.err.println("\t\t pattern find."+p);
                String leadStr = specmatcher.group(1);
                String replacer = "";
                for (int t = 2; t <= specmatcher.groupCount(); t++) {
                    replacer += leadStr + specmatcher.group(t) + "或";
                }
                replacer = replacer.replaceAll("或$", "");
                item = specmatcher.replaceFirst(replacer);
            }
//            System.err.println("\t\t changed content:"+item);
        }

        return item;
    }

    /*
     其他的 字符串 预处理操作
     */
    private String miscStringDeal(String content) {
        // 处理中文问题
        content = content.replaceAll("］", "]");

        // 字符串处理 1 : 
        // Step : () 中嵌套[]的， 拆解为两个修饰词()()
        // 如果[医疗],则删除
        Pattern pt = Pattern.compile(pstr1);
        Matcher mt = pt.matcher(content);
        while (mt.find()) {
            if (mt.group(1).contains("医疗")) {
                content = content.replace(mt.group(1), "");
            } else {      // 拆解为两个修饰词
                content = content.replace(mt.group(1), "");
                String t = new String(mt.group(1));
                t = t.replace("[", "(");
                t = t.replace("]", ")");
                content += t;
            }
        }

        // 字符串处理 2:
        // Step: () 中嵌套，  ,用于描述药物，删除,不参与匹配
        /*
         () 中 出现逗号 ：(叶酸拮抗药，解毒药)-->亚叶酸钙(叶酸拮抗药，解毒药)
         () 中 出现逗号 ：(催眠药，麻醉药)-->依托咪酯(催眠药，麻醉药)
         () 中 出现逗号 ：(雄激素，同化激素类)-->乙雌烯醇(雄激素，同化激素类)
         () 中 出现逗号 ：(解痉药，抗胆碱药)-->乙双苯丙胺(解痉药，抗胆碱药)
         () 中 出现逗号 ：(抗胆碱酯酶药，缩瞳药)-->异氟磷(抗胆碱酯酶药，缩瞳药)
         () 中 出现逗号 ：(抗高血压，利尿剂)-->吲达帕胺(抗高血压，利尿剂)
         () 中 出现逗号 ：(抗胆碱药，散瞳药)-->尤卡托品(抗胆碱药，散瞳药)
         */
        pt = Pattern.compile(pstr4);
        mt = pt.matcher(content);
        while (mt.find()) {
            content = content.replace(mt.group(), "");
        }

        // 字符串处理 3:
        // Step 1.  (-X)格式的，一般对应外国人名，改为-     -\((.)\)
        Pattern p1 = Pattern.compile("\\(-(.+?)\\)");
        Matcher m1 = p1.matcher(content);
        while (m1.find()) {
            String group = m1.group();
            String ref = m1.group(1);
            content = content.replace(group, "-");
        }

        // 字符串处理 4:
        // Step 2. 去除()之间只有一个字, 去除 ‘的$’ '的，' 或类似的副词、介词
        content = content.replaceAll("\\(性\\)", "");
        content = content.replaceAll("\\的[$，]", "");

        return content;
    }

    /*
     rootNode
     |
     |-- OR
     |
     |--- 别名匹配 parseRootIndex 中处理
     |--- 对关键词的语义匹配 parseIndexContent
     |
     |--- AND   (andOper)
     |--- （） 内反向匹配——不能出现与（）中内容反义词 匹配的诊断
     |--- OR  []内及外部词汇匹配
     |--- ...
    
     */
    private ParseTreeResultNode parseIndexContent(String content, int beginDepth) {

//        System.err.println("\t DEBUG( parseIndexContent调用开始,content):"+content);
        ParseTreeResultNode resultNode = new ParseTreeResultNode();
        resultNode.setDepth(beginDepth);

        ParseTreeOperatorNode andOper = new ParseTreeOperatorNode();
        andOper.setDepth(beginDepth + 1);
        andOper.setOperator(ParseTreeOperatorEnum.LOGIC_AND);

        resultNode.setOperNode(andOper);

        Pattern pt = Pattern.compile(pstr1);
        Matcher mt = pt.matcher(content);

        // 字符串预处理
        content = miscStringDeal(content);
//        System.err.println("\t DEBUG( parseIndexContent 完成字符串预处理,content):"+content);

        // 梅尔克松-(罗森塔尔)综合征[梅-(罗)综合征] --> 梅尔克松综合征[梅-(罗)综合征]  或者 梅尔克松-罗森塔尔综合征[梅-(罗)综合征]
        // content.replaceAll("-\\(.{2,}?\\)", "");
        // 非修饰词构成的ParseTreeResultNode 列表 (需要进行 OR 操作)
        List<ParseTreeResultNode> orItemResultNodes = new ArrayList();

        // 处理[]中的内容    [] 内 和 [] 外，都是主导词元素，处理方法应该一致、共用
        pt = Pattern.compile("\\[(.+?)\\]");
        mt = pt.matcher(content);
        while (mt.find()) {

            String item = mt.group(1);          // [] 中的内容
//            System.err.println("\t DEBUG( 发现[],content):"+item);
            // 语义转换
            item = prepareSemanticSplit(item);
//            System.err.println("\t DEBUG( 发现[],完成语义转换, content):"+item);

            orItemResultNodes.add(orRecursiveFunc(item, beginDepth));

            // AND 分解
            // [奥尔德里奇(-威斯科特)综合征]   -->  奥尔德里奇 && 综合征
            // [湿疹-血小板减少-免疫缺陷综合征]  --> 湿疹 && 血小板减少 && 免疫缺陷综合征
            // - ()+
//            ParseTreeResultNode orNode = andRecursiveFunc(item,beginDepth);
//            orItemResultNodes.add(orNode);
        }

        // [] 处理完毕， 删除[]
        content = content.replaceAll("\\[.+?\\]", "");
//        System.err.println("\t DEBUG( 删除[], content"+content);

        // Step 3. 处理()之间的内容
        /*
         ICD 的规则描述：
         () 为辅助性修饰词，不管他是否出现在一个诊断中，都不影响其编码；
         但是，当诊断的修饰词与圆括号中的修饰词相反时，就不能分类与该编码
        
         处理方法：
         如出现 急性   ， 则诊断中不能出现非急性、慢性， 如果() 也出现了 非急性、慢性，则此急性修饰词应删除
         */
        // 获取()内的所有修饰词
        Pattern p = Pattern.compile("\\((.+?)\\)");         // 非贪婪
        Matcher m = p.matcher(content);
        List<String> qualifiers = new ArrayList<String>();
//        while (m.find()) {
//            String qualifier = m.group(1);
//            qualifiers.add(qualifier);
//        }

        // 修饰词构成的ParseTreeResultNode 列表 (需要进行 AND 操作)
        List<ParseTreeResultNode> qualifierResultNodes = new ArrayList();

        // 对于 .*性 类型的修饰词，进行处理： 添加  and not match (反义词)
        // 如果修饰词列表中，同时出现反义词，则丢弃 不做处理
        for (int i = 0; i < qualifiers.size(); i++) {
            String q = qualifiers.get(i);

            if (q.endsWith("性")) {
                String key = q.substring(0, q.length() - 1);
                if (reverseWords.containsKey(key)) {   // 存在对应的预定义的反义词
                    // 反义词是一个String[]
                    boolean needDeal = true;
                    for (String r : reverseWords.get(key)) {
                        if (qualifiers.contains(r)) {   // namech中同时出现相对意义的修饰词, 修饰词应丢弃，不做处理
                            needDeal = false;
                            break;
                        }
                    }

                    // 存在预定义的反义词，且需要处理
                    if (needDeal) {                 //添加  and not match (反义词)

                        String[] rwords = reverseWords.get(key);
                        if (rwords.length > 1) {
                            for (String rword : rwords) {
                                ParseTreeResultNode n = new ParseTreeResultNode();
                                n.setContent(rword);
                                n.setContentOper(ParseTreeOperatorEnum.NOTMATCH);
                                n.setDepth(beginDepth + 1);
                                qualifierResultNodes.add(n);
                            }
                        } else {
                            ParseTreeResultNode n = new ParseTreeResultNode();
                            n.setContent(rwords[0]);
                            n.setContentOper(ParseTreeOperatorEnum.NOTMATCH);
                            n.setDepth(beginDepth + 1);
                            qualifierResultNodes.add(n);
                        }
                    }
                } else {                  // 非开头，去除非；没有非开头，添加非
                    if (q.startsWith("非")) {
                        ParseTreeResultNode n = new ParseTreeResultNode();
                        n.setContent(q.replace("非", "[^非]"));
                        n.setContentOper(ParseTreeOperatorEnum.NOTMATCH);
                        n.setDepth(beginDepth + 1);
                        qualifierResultNodes.add(n);
                    } else {
                        ParseTreeResultNode n = new ParseTreeResultNode();
                        n.setContent("非" + q);
                        n.setContentOper(ParseTreeOperatorEnum.NOTMATCH);
                        n.setDepth(beginDepth + 1);
                        qualifierResultNodes.add(n);
                    }
                }

            } else if (q.startsWith("非")) {              // 其他修饰词作为 OR 条件加入   ???????
                ParseTreeResultNode n = new ParseTreeResultNode();
                n.setContent(q.replace("非", "[^非]"));
                n.setContentOper(ParseTreeOperatorEnum.NOTMATCH);
                n.setDepth(beginDepth + 1);
                qualifierResultNodes.add(n);
            }
        }

        andOper.getSubResults().addAll(qualifierResultNodes);

        // 处理完() 删除()
        content = content.replaceAll("\\(.+?\\)", "");

//        System.err.println("\t DEBUG( 删除(), content"+content);
        // 语义转换
        content = prepareSemanticSplit(content);
//        System.err.println("\t DEUG(语义转换后(LAST)， content :"+content);

        // 剩下的内容，当成[]中的内容处理
        orItemResultNodes.add(orRecursiveFunc(content, beginDepth));

        ParseTreeOperatorNode orNode = new ParseTreeOperatorNode();
        orNode.setDepth(andOper.getDepth() + 2);

        orNode.setOperator(ParseTreeOperatorEnum.LOGIC_OR);

        for (ParseTreeResultNode n : orItemResultNodes) {
            n.setDepth(orNode.getDepth() + 1);
        }
        orNode.getSubResults().addAll(orItemResultNodes);

        ParseTreeResultNode betweenAndor = new ParseTreeResultNode();
        betweenAndor.setDepth(andOper.getDepth() + 1);
        betweenAndor.setOperNode(orNode);

        andOper.getSubResults().add(betweenAndor);

        return resultNode;
    }

    private Analyzer ansjHeightAnalyzer = new AnsjAnalysis();

    

    private String toHighlighter(Analyzer analyzer, Query query, Document doc) throws InvalidTokenOffsetsException {
        String field = "text";
        try {
            SimpleHTMLFormatter simpleHtmlFormatter = new SimpleHTMLFormatter("<font color=\"red\">", "</font>");
            Highlighter highlighter = new Highlighter(simpleHtmlFormatter, new QueryScorer(query));
            TokenStream tokenStream1 = analyzer.tokenStream("text", new StringReader(doc.get(field)));
            String highlighterStr = highlighter.getBestFragment(tokenStream1, doc.get(field));
            return highlighterStr == null ? doc.get(field) : highlighterStr;
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (InvalidTokenOffsetsException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
    }

    private void addContent(IndexWriter iwriter, String text, String guid, int nodes,String type) throws CorruptIndexException, IOException {
        Document doc = new Document();
        doc.add(new Field("text", text, Field.Store.YES, Field.Index.ANALYZED));
        doc.add(new Field("guid", guid, Field.Store.YES, Field.Index.NOT_ANALYZED));
        doc.add(new Field("nodes",""+nodes, Field.Store.YES, Field.Index.NOT_ANALYZED));
        doc.add(new Field("type",type,Field.Store.YES,Field.Index.NOT_ANALYZED));
        /**
         text  ,guid,type  
         */
        iwriter.addDocument(doc);
    }
     
    
    

    public void searchDiagName(String diagName) throws IOException {
        IndexReader reader = DirectoryReader.open(this.directory);
        IndexSearcher searcher = new IndexSearcher(reader);

        Query query = new TermQuery(new Term("pathDesc", diagName));

        TopDocs ts = searcher.search(query, null, 100);
        long endTime = System.currentTimeMillis();

        for (int i = 0; i < ts.scoreDocs.length; i++) {
            // rs.scoreDocs[i].doc 是获取索引中的标志位id, 从0开始记录  
            Document firstHit = searcher.doc(ts.scoreDocs[i].doc);
            System.out.println("guid:" + firstHit.getField("guid").stringValue());
//            System.out.println("sex:" + firstHit.getField("sex").stringValue());  
            System.out.println("pathDesc:" + firstHit.getField("pathDesc").stringValue());
        }
        reader.close();
        directory.close();
        System.out.println("*****************检索结束**********************");
    }

    public boolean RootContentHit(String diagName) {
        boolean ret = false;                // Hit?
        for (IcdDiseaseIndex i : this.allRootIndexItems) {
//            System.err.println(" RootContentHit ??  ="+i.getNameCh());
//            System.err.println("$$$$$$$$$$$$$$"+i.getParseTreeRoot());
            Boolean b = i.getParseTreeRoot().compute(diagName);
            if (b) {
                System.err.println("\t\t 主导词解析成功：" + i.getNameCh() + " ~ " + diagName + "  @ ICD CODE:" + i.getIcdCode());
                ret = true;
            }
        }
        return ret;
    }
}
