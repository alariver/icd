/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package net.skyatlas.icd.dao.daoImpl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.util.Date;
import java.util.HashSet;
import java.util.ResourceBundle;
import love.cq.util.IOUtil;
import org.ansj.lucene.util.PorterStemmer;
import org.ansj.lucene4.AnsjAnalysis;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.Token;
import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;

import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.search.highlight.Highlighter;
import org.apache.lucene.search.highlight.InvalidTokenOffsetsException;
import org.apache.lucene.search.highlight.QueryScorer;
import org.apache.lucene.search.highlight.SimpleHTMLFormatter;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.LockObtainFailedException;
import org.apache.lucene.store.RAMDirectory;
import org.apache.lucene.util.Version;
import org.junit.Test;

/**
 *
 * @author changzhenghe
 */
public class AnsjAnalysisTest {

    @Test
    public void test() throws IOException {
        Token nt = new Token();
        Analyzer ca = new AnsjAnalysis();
        Reader sentence = new StringReader(
                "\n\n\n\n\n\n\n我从小就不由自主地认为自己长大以后一定得成为一个象我父亲一样的画家, 可能是父母潜移默化的影响。其实我根本不知道作为画家意味着什么，我是否喜欢，最重要的是否适合我，我是否有这个才华。其实人到中年的我还是不确定我最喜欢什么，最想做的是什么？我相信很多人和我一样有同样的烦恼。毕竟不是每个人都能成为作文里的宇航员，科学家和大教授。知道自己适合做什么，喜欢做什么，能做好什么其实是个非常困难的问题。"
                + "幸运的是，我想我的孩子不会为这个太过烦恼。通过老大，我慢慢发现美国高中的一个重要功能就是帮助学生分析他们的专长和兴趣，从而帮助他们选择大学的专业和未来的职业。我觉得帮助一个未成形的孩子找到她未来成长的方向是个非常重要的过程。"
                + "美国高中都有专门的职业顾问，通过接触不同的课程，和各种心理，个性，兴趣很多方面的问答来帮助每个学生找到最感兴趣的专业。这样的教育一般是要到高年级才开始， 可老大因为今年上计算机的课程就是研究一个职业走向的软件项目，所以她提前做了这些考试和面试。看来以后这样的教育会慢慢由电脑来测试了。老大带回家了一些试卷，我挑出一些给大家看看。这门课她花了2个多月才做完，这里只是很小的一部分。"
                + "在测试里有这样的一些问题："
                + "你是个喜欢动手的人吗？ 你喜欢修东西吗？你喜欢体育运动吗？你喜欢在室外工作吗？你是个喜欢思考的人吗？你喜欢数学和科学课吗？你喜欢一个人工作吗？你对自己的智力自信吗？你的创造能力很强吗？你喜欢艺术，音乐和戏剧吗？  你喜欢自由自在的工作环境吗？你喜欢尝试新的东西吗？ 你喜欢帮助别人吗？你喜欢教别人吗？你喜欢和机器和工具打交道吗？你喜欢当领导吗？你喜欢组织活动吗？你什么和数字打交道吗？");
        TokenStream ts = ca.tokenStream("sentence", sentence);

        System.out.println("start: " + (new Date()));
        long before = System.currentTimeMillis();
        while (ts.incrementToken()) {
            System.out.println(ts.getAttribute(CharTermAttribute.class));
        }
        ts.close();
        long now = System.currentTimeMillis();
        System.out.println("time: " + (now - before) / 1000.0 + " s");
    }

    @Test
    public void indexTest() throws CorruptIndexException, LockObtainFailedException, IOException {
        HashSet<String> hs = new HashSet<String>();
//        BufferedReader reader2 = IOUtil.getReader(ResourceBundle.getBundle("library").getString("stopLibrary"), "UTF-8");
//        String word = null;
//        while ((word = reader2.readLine()) != null) {
//            hs.add(word);
//        }
        Analyzer analyzer = new AnsjAnalysis(hs, false);
        Directory directory = null;
        IndexWriter iwriter = null;

//        BufferedReader reader = IOUtil.getReader("/Users/ansj/Desktop/未命名文件夹/indextest.txt", "UTF-8");
//        String temp = null;
//        StringBuilder sb = new StringBuilder();
//        while ((temp = reader.readLine()) != null) {
//            sb.append(temp);
//            sb.append("\n");
//        }
//        reader.close();
        String text =  "开源项目管理你喜欢在室外工作吗？你是个喜欢思考的人吗？你喜欢数学和科学课吗？你喜欢一个人工作吗？你对自己的智力自信吗？你的创造能力很强吗？你喜欢艺术，音乐和戏剧吗？  你喜欢自由自在的工作环境吗？你喜欢尝试新的东西吗？ 你喜欢帮助别人吗？你喜欢教别人吗？你喜欢和机器和工具打交道吗？你喜欢当领导吗？你喜欢组织活动吗？你什么和数字打交道吗？";

        IndexWriterConfig ic = new IndexWriterConfig(Version.LUCENE_32, analyzer);
        // 建立内存索引对象
        directory = new RAMDirectory();
        iwriter = new IndexWriter(directory, ic);
    // BufferedReader reader =
        // IOUtil.getReader("/Users/ansj/Documents/快盘/分词/语料/1998年人民日报分词语料_未区分.txt",
        // "GBK");
        // String temp = null;
        // while ((temp = reader.readLine()) != null) {
        // addContent(iwriter, temp);
        // }
        addContent(iwriter, text);
        addContent(iwriter, text);
        addContent(iwriter, text);
        addContent(iwriter, text);
        iwriter.commit();
        iwriter.close();

        System.out.println("索引建立完毕");

//        search(analyzer, directory, "室外工作");
    }

    private void addContent(IndexWriter iwriter, String text) throws CorruptIndexException, IOException {
        Document doc = new Document();
        doc.add(new Field("text", text, Field.Store.YES, Field.Index.ANALYZED));
        iwriter.addDocument(doc);
    }
}
