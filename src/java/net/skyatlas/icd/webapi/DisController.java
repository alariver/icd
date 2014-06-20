/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.skyatlas.icd.webapi;
 
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import net.skyatlas.icd.comm.GeneralJsonModel;
import net.skyatlas.icd.comm.ReturnInfo;
import net.skyatlas.icd.domain.IcdDisease;
import net.skyatlas.icd.domain.IcdDiseaseIndex;
import net.skyatlas.icd.util.MemoryGrid;
import net.skyatlas.icd.util.SearchPath;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
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
    private IcdDisease dis;
    @RequestMapping(value = "/diseaseThree/search0Dis", method = RequestMethod.GET)
    @ResponseBody
    public  String  search0Dis(@RequestParam("name") String name,@RequestParam("type") String type) {
        // List result = indexService.getIndexListDis(text, "precision", "ch", null, Integer.parseInt(content));
        GeneralJsonModel gjm = new GeneralJsonModel();
        gjm.setRetCode(0);
        //IcdDiseaseIndex  icdDiseaseIndex=null;
        List<SearchPath> paths = new ArrayList();
        List<IcdDiseaseIndex> list = new ArrayList();
        IcdDiseaseIndex icdDiseaseIndex = new IcdDiseaseIndex();
        List<IcdDiseaseIndex> idiList = new ArrayList();
        try{
       
          list = grid.getVol3NameIndexedItems().get(name);
          for(int i = 0 ; i < list.size() ; i++){
              IcdDiseaseIndex e = list.get(i);
              if(e.getDepth()==0){
                  idiList.add(e);
              }
          }
          /* 
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
          */
        }catch(Exception e){
            gjm.setRetCode(ReturnInfo.UNKNOWNERROR);
            gjm.setRetInfo(e.toString());
            e.printStackTrace();
        }
        gjm.setData(idiList);
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
    public String editDiseaseOne(IcdDisease dis){
        GeneralJsonModel gjm = new GeneralJsonModel();
        gjm.setRetCode(0);
        try{
            grid.getDao().editDisease(dis);
            IcdDisease d = grid.getVol1IDIndexedItems().get(dis.getId());
            if(dis.getCodeNameCh()==""){
                d.setCodeNameCh(null);
            }else{
            d.setCodeNameCh(dis.getCodeNameCh());
            }
            if(dis.getIcdCode()==""){   
                d.setIcdCode(null);
            }else{
                d.setIcdCode(dis.getIcdCode());
            }
            if(dis.getSwordCode()==""){   
                d.setSwordCode(null);
            }else{
                d.setSwordCode(dis.getSwordCode());
            }
            if(dis.getStarCode()==""){   
                d.setStarCode(null);
            }else{
                d.setStarCode(dis.getStarCode());
            }
            d.setPage(dis.getPage());
            d.setCodeType(dis.getCodeType());
            if(dis.getNoteCh()==""){
                d.setNoteCh(null);
            }else{
                d.setNoteCh(dis.getNoteCh());
            }
            gjm.setData(dis);
            gjm.setRetInfo("疾病编码保存成功");
        }catch(Exception e){
            gjm.setRetCode(ReturnInfo.UNKNOWNERROR);
            gjm.setRetInfo(e.toString());
            e.printStackTrace();
        }
        
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
