/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.util;

import net.skyatlas.icd.domain.IcdDiseaseIndex;

/**
 * Vol 3
 *  搜索路径中的节点
 * Deprecated: 直接使用IcdDiseaseIndex代替
 * @author changzhenghe
 */
public class SearchNode {
    private         String          nodeDesc;
//    private         int        depth;
    private         String          icdCode;            // 路径终点 包含icdCode
    private         Integer         id;
    private         IcdDiseaseIndex     refIndex;
    private         String[]        aliases;
    private         String[]        excludedAliases;
    private         String[]        requiredAliases;            // 可能引起混淆，暂时不使用

    public String getNodeDesc() {
        return nodeDesc;
    }

    public void setNodeDesc(String nodeDesc) {
        this.nodeDesc = nodeDesc;
    }

//    public NodeType getNodetype() {
//        return nodetype;
//    }
//
//    public void setNodetype(NodeType nodetype) {
//        this.nodetype = nodetype;
//    }

    public String getIcdCode() {
        return icdCode;
    }

    public void setIcdCode(String icdCode) {
        this.icdCode = icdCode;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public IcdDiseaseIndex getRefIndex() {
        return refIndex;
    }

    public void setRefIndex(IcdDiseaseIndex refIndex) {
        this.refIndex = refIndex;
    }

    public String[] getAliases() {
        return aliases;
    }

    public void setAliases(String[] aliases) {
        this.aliases = aliases;
    }

    public String[] getExcludedAliases() {
        return excludedAliases;
    }

    public void setExcludedAliases(String[] excludedAiases) {
        this.excludedAliases = excludedAiases;
    }

    public String[] getRequiredAliases() {
        return requiredAliases;
    }

    public void setRequiredAliases(String[] requiredAliases) {
        this.requiredAliases = requiredAliases;
    }
    
    
}
