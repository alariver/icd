/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package net.skyatlas.icd.test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.ResourceBundle;
import love.cq.util.IOUtil;
import org.ansj.app.keyword.KeyWordComputer;
import org.ansj.app.keyword.Keyword;
import org.ansj.domain.Term;
import org.ansj.library.UserDefineLibrary;
import org.ansj.lucene4.AnsjAnalysis;
import org.ansj.recognition.NatureRecognition;
import org.ansj.splitWord.analysis.NlpAnalysis;
import org.ansj.splitWord.analysis.ToAnalysis;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.Token;
import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
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
public class AnsegTest {

    static public void main(String[] args) throws IOException, CorruptIndexException, ParseException, InvalidTokenOffsetsException {
        AnsegTest inst = new AnsegTest();
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

        HashSet<String> hs = new HashSet<String>();
        BufferedReader reader2 = IOUtil.getReader(ResourceBundle.getBundle("library").getString("stopLibrary"), "UTF-8");
        String word = null;
        while ((word = reader2.readLine()) != null) {
            hs.add(word);
        }
        Analyzer analyzer = new AnsjAnalysis(hs, false);
        Directory directory = null;
        IndexWriter iwriter = null;

        BufferedReader reader = IOUtil.getReader("/Users/changzhenghe/Downloads/hy_statspack01.txt", "UTF-8");
        String temp = null;
        StringBuilder sb = new StringBuilder();
        while ((temp = reader.readLine()) != null) {
            sb.append(temp);
            sb.append("\n");
        }
        reader.close();
        String text = sb.toString();

        text = "开源项目管理你喜欢在室外工作吗？你是个喜欢思考的人吗？你喜欢数学和科学课吗？你喜欢一个人工作吗？你对自己的智力自信吗？你的创造能力很强吗？你喜欢艺术，音乐和戏剧吗？  你喜欢自由自在的工作环境吗？你喜欢尝试新的东西吗？ 你喜欢帮助别人吗？你喜欢教别人吗？你喜欢和机器和工具打交道吗？你喜欢当领导吗？你喜欢组织活动吗？你什么和数字打交道吗？";

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
        inst.addContent(iwriter, "神经错乱的全身性麻痹	见于(由于)	痴呆(持续性)");
        inst.addContent(iwriter, "系统性红斑狼疮	见于(由于)	痴呆(持续性)");
        inst.addContent(iwriter, "抑郁或妄想狂样型	老年性	痴呆(持续性)");
        inst.addContent(iwriter, "朗格汉斯细胞	单核吞噬细胞NEC	组织细胞增多症");
        inst.addContent(iwriter, "巴贝虫病");
        iwriter.commit();
        iwriter.close();

        System.out.println("索引建立完毕");

        inst.search(analyzer, directory, "室外工作");
        inst.search(analyzer, directory, "细胞增多");
        inst.search(analyzer, directory, "红斑狼疮");
        inst.search(analyzer, directory, "巴贝虫病");
                

        /*
         KeyWordComputer kwc = new KeyWordComputer(5);
         String title = "维基解密否认斯诺登接受委内瑞拉庇护";
         String content = "有俄罗斯国会议员，9号在社交网站推特表示，美国中情局前雇员斯诺登，"
         + "已经接受委内瑞拉的庇护，不过推文在发布几分钟后随即删除。俄罗斯当局拒绝发表评论，"
         + "而一直协助斯诺登的维基解密否认他将投靠委内瑞拉。　　俄罗斯国会国际事务委员会主席普什科夫，"
         + "在个人推特率先披露斯诺登已接受委内瑞拉的庇护建议，令外界以为斯诺登的动向终于有新进展。　　"
         + "不过推文在几分钟内旋即被删除，普什科夫澄清他是看到俄罗斯国营电视台的新闻才这样说，"
         + "而电视台已经作出否认，称普什科夫是误解了新闻内容。　　"
         + "委内瑞拉驻莫斯科大使馆、俄罗斯总统府发言人、以及外交部都拒绝发表评论。"
         + "而维基解密就否认斯诺登已正式接受委内瑞拉的庇护，说会在适当时间公布有关决定。　　"
         + "斯诺登相信目前还在莫斯科谢列梅捷沃机场，已滞留两个多星期。他早前向约20个国家提交庇护申请，"
         + "委内瑞拉、尼加拉瓜和玻利维亚，先后表示答应，不过斯诺登还没作出决定。　　而另一场外交风波，"
         + "玻利维亚总统莫拉莱斯的专机上星期被欧洲多国以怀疑斯诺登在机上为由拒绝过境事件，"
         + "涉事国家之一的西班牙突然转口风，外长马加略]号表示愿意就任何误解致歉，"
         + "但强调当时当局没有关闭领空或不许专机降落。";
         Collection<Keyword> result = kwc.computeArticleTfidf(title, content);
         System.out.println(result);

         AnsegTest t = new AnsegTest();
         List<Term> parse = ToAnalysis.parse("先天性耳前瘘感染");
         System.out.println(parse);
         System.out.println("*********** 添加用户定义新词 ************");
         //        UserDefineLibrary.insertWord("锥虫胂胺", "userDefine", 1000);
         //        UserDefineLibrary.insertWord("抗锥虫药", "userDefine", 1000);
         UserDefineLibrary.insertWord("福诺二七〇", "userDefine", 1000);
         parse = ToAnalysis.parse("易复性腹股沟疝（右侧）");
         System.out.println(parse);
         */
    }
    private Analyzer ansjHeightAnalyzer = new AnsjAnalysis();

    private void search(Analyzer analyzer, Directory directory, String queryStr) throws CorruptIndexException, IOException, ParseException, InvalidTokenOffsetsException {
        IndexSearcher isearcher;
        IndexReader reader = DirectoryReader.open(directory);
        // 查询索引
        isearcher = new IndexSearcher(reader);
        QueryParser tq = new QueryParser(Version.LUCENE_32, "text", ansjHeightAnalyzer);
        Query query = tq.parse(queryStr);
        System.out.println(query);
        TopDocs hits = isearcher.search(query, 5);
        System.out.println(queryStr + ":共找到" + hits.totalHits + "条记录!");
        for (int i = 0; i < hits.scoreDocs.length; i++) {
            int docId = hits.scoreDocs[i].doc;
            Document document = isearcher.doc(docId);
            System.out.println(toHighlighter(ansjHeightAnalyzer, query, document));
        }
    }

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

    private void addContent(IndexWriter iwriter, String text) throws CorruptIndexException, IOException {
        Document doc = new Document();
        doc.add(new Field("text", text, Field.Store.YES, Field.Index.ANALYZED));
        iwriter.addDocument(doc);
    }
}
