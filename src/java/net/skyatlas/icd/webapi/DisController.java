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
import net.skyatlas.icd.domain.IcdDiseaseRelation;
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
        
        GeneralJsonModel gjm = new GeneralJsonModel();
        gjm.setRetCode(0);
      
        
        List<IcdDiseaseIndex> list = new ArrayList();
        List<IcdDiseaseIndex> idiList = new ArrayList();
        try{
            //第一步 ，判断name是拼音还是文字
            
            
          list = grid.getVol3NameIndexedItems().get(name);
          for(int i = 0 ; i < list.size() ; i++){
              IcdDiseaseIndex e = list.get(i);
              if(e.getDepth()==0){
                  idiList.add(e);
              }
          }
         
        }catch(Exception e){
            gjm.setRetCode(ReturnInfo.UNKNOWNERROR);
            gjm.setRetInfo(e.toString());
            e.printStackTrace();
        }
        gjm.setData(idiList);
        gjm.setRetInfo("疾病编码索引...");
        return gjm.toJSONStr();
    }
    @RequestMapping(value = "/diseaseThree/search1Dis", method = RequestMethod.GET)
    @ResponseBody
    public  String  search1Dis(@RequestParam("name") String name) {
        GeneralJsonModel gjm = new GeneralJsonModel();
        gjm.setRetCode(0);
        try{
            //第一步，判断是否为拼音
            grid.getVol3NameIndexedItems().get(name);
         /*   Pattern pat = Pattern.compile("/\\D/");  
            Matcher mat = pat.matcher(name);  
            
            mat.find();*/
        }catch(Exception e){
            gjm.setRetCode(ReturnInfo.UNKNOWNERROR);
            gjm.setRetInfo(e.toString());
            e.printStackTrace();
        }
        gjm.setData(dis);
        gjm.setRetInfo("疾病编码查询成功...");
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
        gjm.setRetInfo("疾病编码查询成功...");
        return gjm.toJSONStr();
    }
    
    @RequestMapping(value="/diseaseOne/edit",method=RequestMethod.POST)
    @ResponseBody
    public String editDiseaseOne(IcdDisease dis){
        GeneralJsonModel gjm = new GeneralJsonModel();
        gjm.setRetCode(0);
        try{
            grid.getDao().editDisease(dis);
            //放入grid
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
            gjm.setRetInfo("保存成功");
        }catch(Exception e){
            gjm.setRetCode(ReturnInfo.UNKNOWNERROR);
            gjm.setRetInfo(e.toString());
            e.printStackTrace();
        }
        
        return gjm.toJSONStr();
    }
    @RequestMapping(value="/diseaseRelation/edit",method=RequestMethod.POST)
    @ResponseBody
    public String editDiseaseRelation(IcdDiseaseRelation dr){
        GeneralJsonModel gjm = new GeneralJsonModel();
        gjm.setRetCode(0);
        try{
            if(dr.getId()==null||dr.getId()==0){
                return null;
            }
             
            if(dr.getMainID()==0){
                dr.setMainID(null);
            } 
            if(dr.getNoteCh()==""){
                dr.setNoteCh(null);
            } 
            if(dr.getNoteEn()==""){
                dr.setNoteEn(null);
            }
            if(dr.getPage()==0){
                dr.setPage(null);
            }
            if(dr.getParentID()==0){
                dr.setParentID(null);
            }
            if(dr.getReferenceCode()==""){
                dr.setReferenceCode(null);
            } 
            if(dr.getReferenceCodeFull()==""){
                dr.setReferenceCodeFull(null);
            } 
            if(dr.getReferenceID()==0){
                dr.setReferenceID(null);
            } 
            if(dr.getRelationContentCh()==""){
                dr.setRelationContentCh(null);
            } 
            if(dr.getRelationContentEn()==""){
                dr.setRelationContentEn(null);
            } 
            if(dr.getRelationType()==""){
                dr.setRelationType(null);
            } 
            
            grid.getIcdDisRelationDao().editDiseaseRelation(dr);
             //edit grid
             IcdDiseaseRelation idi = grid.getVol1IDRelationIndexedItems().get(dr.getId());
                idi.setMainID(dr.getMainID());
                idi.setNoteCh(dr.getNoteCh());
                idi.setNoteEn(dr.getNoteEn());
                idi.setPage(dr.getPage());
                idi.setParentID(dr.getParentID());
                idi.setReferenceCode(dr.getReferenceCode());
                idi.setReferenceCodeFull(dr.getReferenceCodeFull());
                idi.setReferenceID(dr.getReferenceID());
                idi.setRelationContentCh(dr.getRelationContentCh());
                idi.setRelationContentEn(dr.getRelationContentEn());
                idi.setRelationType(dr.getRelationType());
            gjm.setData(dr);
            gjm.setRetInfo("保存成功");
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
