/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import net.skyatlas.icd.domain.IcdDisease;
import net.skyatlas.icd.domain.IcdDiseaseIndex;

/**
 * ICD 搜索路径
 * 从 主导词 起， 到ICDDisease 止
 * @author changzhenghe
 */
public class SearchPathShowObj {
    private         List<IcdIndexDiseaseShowObj>        nodeList = new ArrayList();   
    private         String                  chapter;                // 章
    private         String                  section;                // 节
    private         String                  clazz;                  // 类目
    private         String                  subclazz;               // 亚目
    private         IcdDisease              terminal;               // 路径终点 ICD Disease
    private         Integer                 nodes;                  // 路径的节点数量
    private         String                   pathHashCode;           // 路径的GUID值
    private         IcdDiseaseIndex         startPoint;             // 路径起点

    public List<IcdIndexDiseaseShowObj> getNodeList() {
        return nodeList;
    }

    public void setNodeList(List<IcdIndexDiseaseShowObj> nodeList) {
        this.nodeList = nodeList;
    }

    public String getChapter() {
        return chapter;
    }

    public void setChapter(String chapter) {
        this.chapter = chapter;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getClazz() {
        return clazz;
    }

    public void setClazz(String clazz) {
        this.clazz = clazz;
    }

    public String getSubclazz() {
        return subclazz;
    }

    public void setSubclazz(String subclazz) {
        this.subclazz = subclazz;
    }

    public IcdDisease getTerminal() {
        return terminal;
    }

    public void setTerminal(IcdDisease terminal) {
        this.terminal = terminal;
    }

    public Integer getNodes() {
        return nodes;
    }

    public void setNodes(Integer nodes) {
        this.nodes = nodes;
    }

    public String getPathHashCode() {
        return pathHashCode;
    }

    public void setPathHashCode(String pathHashCode) {
        this.pathHashCode = pathHashCode;
    }

    public IcdDiseaseIndex getStartPoint() {
        return startPoint;
    }

    public void setStartPoint(IcdDiseaseIndex startPoint) {
        this.startPoint = startPoint;
    }

    public SearchPathShowObj() {
        UUID str =java.util.UUID.randomUUID();
        this.pathHashCode = str.toString();
    }

    @Override
    public String toString() {
        return "SearchPath{" + "nodeList=" + nodeList 
                + ", chapter=" + chapter + ", section=" + section + ", clazz=" 
                + clazz + ", subclazz=" + subclazz + ", terminal=" + terminal + ", nodes=" 
                + nodes + ", pathHashCode=" + pathHashCode + ", startPoint=" + startPoint + '}';
    }
    
    public  SearchPathShowObj(SearchPath path) {
        this.setChapter(path.getChapter());
        this.setClazz(path.getClazz());
        this.setNodes(path.getNodes());
        this.setPathHashCode(path.getPathHashCode());
        this.setSection(path.getSection());
        this.setStartPoint(path.getStartPoint());
        this.setSubclazz(path.getSubclazz());
//        this.setTerminal(path.getTerminal());
        
        if (this.getNodeList() == null) {
            this.setNodeList(new ArrayList());
            
        }
        for (IcdDiseaseIndex index : path.getNodeList()) {
            this.getNodeList().add(new IcdIndexDiseaseShowObj(index));
        }
    }
    
}
