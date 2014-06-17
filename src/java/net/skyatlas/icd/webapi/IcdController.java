/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.webapi;

import net.skyatlas.icd.comm.GeneralJsonModel;
import net.skyatlas.icd.comm.ReturnInfo;
import net.skyatlas.icd.util.MemoryGrid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author changzhenghe
 */
@Controller
@RequestMapping(value = "/api")
public class IcdController {
    @RequestMapping(value = "/icd/autocode", method = RequestMethod.GET)
    @ResponseBody
    public  String    autoCode(@RequestParam("diagName")String diagName) {
        System.err.println(" URL /api/icd/autocode   diagName:"+diagName);
        GeneralJsonModel gjm = new GeneralJsonModel();
        gjm.setRetCode(0);
        try {
            gjm.setData(grid.searchSvc(diagName));
        }
        catch(Exception e) {
            gjm.setRetCode(ReturnInfo.UNKNOWNERROR);
            gjm.setRetInfo(e.toString());
            
        }
        gjm.setRetInfo("自动编码...");
        return gjm.toJSONStr();
    }
    
    @Autowired()
    private MemoryGrid  grid;
}
