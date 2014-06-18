/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.skyatlas.icd.webapi;
 
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.enterprise.context.RequestScoped;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import net.skyatlas.icd.comm.GeneralJsonModel;
import net.skyatlas.icd.comm.ReturnInfo;
import net.skyatlas.icd.domain.IcdDisease;
import net.skyatlas.icd.domain.IcdDiseaseIndex;
import net.skyatlas.icd.util.MemoryGrid;
import net.skyatlas.icd.util.SearchPath;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
 

/**
 *
 * @author cjl
 */
@Controller
@RequestMapping(value = "/api")
public class DisController {
    @Autowired()
    private MemoryGrid grid;
    @RequestMapping(value = "/diseaseThree/search0Dis", method = RequestMethod.GET)
    @ResponseBody
    public  String  search0Dis(@RequestParam("name") String name,@RequestParam("type") String type) {
        // List result = indexService.getIndexListDis(text, "precision", "ch", null, Integer.parseInt(content));
        GeneralJsonModel gjm = new GeneralJsonModel();
        gjm.setRetCode(0);
        //IcdDiseaseIndex  icdDiseaseIndex=null;
        List<SearchPath> paths = new ArrayList();
        List<IcdDiseaseIndex> list = new ArrayList();
       
        try{
       
          list = grid.getVol3NameIndexedItems().get(name);
          
          //遍历取出主导词
          for(int i=0;i<list.size();i++){
              IcdDiseaseIndex o = list.get(i);
              if(o.getDepth()==0){
                 SearchPath ls = grid.getRootIndexedSearchPaths().get(o);
                 if(ls!=null){
                    paths.add(ls);
                 }
              }
          }
          
        }catch(Exception e){
            gjm.setRetCode(ReturnInfo.UNKNOWNERROR);
            gjm.setRetInfo(e.toString());
            e.printStackTrace();
        }
        gjm.setData(paths);
        gjm.setRetInfo("疾病编码索引...");
        return gjm.toJSONStr();
    }
    @RequestMapping(value = "/diseaseOne/searchDis", method = RequestMethod.GET)
    @ResponseBody
    public String searchDiseaseOne(@RequestParam("inputCode") String inputCode){
        GeneralJsonModel gjm = new GeneralJsonModel();
        gjm.setRetCode(0);
        
        IcdDisease dis = new IcdDisease();
        try{
            List<IcdDisease> l = grid.getVol1IcdIndexedItems().get(inputCode.toUpperCase());
            dis = l.get(0);
         //1，取得IcdDisease or IcdMcode
            
         //2，取树
        }catch(Exception e){
            gjm.setRetCode(ReturnInfo.UNKNOWNERROR);
            gjm.setRetInfo(e.toString());
            e.printStackTrace();
        }
        gjm.setData(dis);
        gjm.setRetInfo("疾病编码核对...");
        return gjm.toJSONStr();
    }
    
    @RequestMapping(value="/diseaseOne/edit",method=RequestMethod.POST)
    @ResponseBody
    public String editDiseaseOne(@RequestBody IcdDisease dis){
         /*,@RequestParam("icdCode")String icdCode,
    @RequestParam("swordCode")String swordCode,@RequestParam("starCode")String starCode,@RequestParam("page")Integer page,
    @RequestParam("codeType")String codeType,@RequestParam("noteCh")String noteCh*/
        GeneralJsonModel gjm = new GeneralJsonModel();
        gjm.setRetCode(0);
       // IcdDisease d =  grid.getVol1IDIndexedItems().get(id);
        try{
           
           
        //   d.setCodeNameCh(codeNameCh);
          /* d.setIcdCode(icdCode);
           d.setStarCode(starCode);
           d.setSwordCode(swordCode);
           d.setPage(page);
           d.setCodeType(codeType);
           d.setNoteCh(noteCh);*/
       //    grid.getDao().editDisease(d);
        }catch(Exception e){
            gjm.setRetCode(ReturnInfo.UNKNOWNERROR);
            gjm.setRetInfo(e.toString());
            e.printStackTrace();
        }
     //   gjm.setData(d);
        gjm.setRetInfo("疾病编码保存成功");
        return gjm.toJSONStr();
    }
    public boolean isMCode(String code) {
        Pattern mask = Pattern.compile("[mM]\\d{4}[/]\\d|[mM]\\d{3}.*");
        Matcher matcher = mask.matcher(code);
        return matcher.matches();
    }
    public MemoryGrid getGrid() {
        return grid;
    }

    public void setGrid(MemoryGrid grid) {
        this.grid = grid;
    }

   
    
}
