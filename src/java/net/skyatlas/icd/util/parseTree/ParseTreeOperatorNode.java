/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.util.parseTree;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author changzhenghe
 */
public class ParseTreeOperatorNode extends TreeNode {
    private         ParseTreeOperatorEnum        operator;                   
    private         List<ParseTreeResultNode>    subResults = new ArrayList();             // 下一层操作结果
    private         Integer                     depth;
    
    public  void    sortDepth() {
        for (ParseTreeResultNode n : subResults) {
            n.setDepth(this.depth + 1);
        }
    }
    
    public ParseTreeOperatorEnum getOperator() {
        return operator;
    }

    public void setOperator(ParseTreeOperatorEnum operator) {
        this.operator = operator;
    }

    public List<ParseTreeResultNode> getSubResults() {
        return subResults;
    }

    public void setSubResults(List<ParseTreeResultNode> subResults) {
        this.subResults = subResults;
    }

    public Integer getDepth() {
        return depth;
    }

    public void setDepth(Integer depth) {
        this.depth = depth;
        sortDepth();
    }
    
    

    @Override
    public boolean compute(String str) {          // 对下一层操作结果，使用逻辑操作符进行计算
        boolean br = true;
        try {
            switch (this.operator) {
                case LOGIC_AND:
                    for (int i=0; i< subResults.size(); i++) {
                        if (!subResults.get(i).compute(str)) {
                            return false;           // 短路操作
                        }

                    }
                break;
                case LOGIC_OR:
                    br = false;
                    for (int i=0; i<subResults.size(); i++) {
                        if (subResults.get(i).compute(str)) {
                            return true;
                        }
                    }
                break;
                default:
                    throw new RuntimeException("不支持的操作符!");
            }
        }
        catch(Exception e) {
            e.printStackTrace();
            System.err.println("NULL???? operator:"+this.operator+"\t depth:"+this.depth + "\t subresults:"+this.subResults);
        }
        return br;
    }

    @Override
    public String toString() {
        StringBuilder str = new StringBuilder("");
        for (int i=0;i<=depth;i++) {
            str.append("\t->");
        }
        str.append("OPERATOR :");
        if (this.operator == ParseTreeOperatorEnum.LOGIC_AND) {
            str.append("AND");
        }
        else {
            str.append("OR");
        }
        str.append("\n");
        for (int i=0;i<this.subResults.size();i++) {
            str.append(this.subResults.get(i).toString());
        }
        
        return str.toString();
    }
    
    
}
