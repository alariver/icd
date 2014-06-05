/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.util.parseTree;

/**
 *
 * @author changzhenghe
 */
public class ParseTreeResultNode extends TreeNode {
    private         String          content;        // 叶子节点时有值
    private         ParseTreeOperatorEnum    contentOper = ParseTreeOperatorEnum.MATCH;       // 匹配  不匹配                
    private         ParseTreeOperatorNode    operNode;
    private         Integer         depth;          // root - 0,
    
    public  void sortDepth() {
        if (operNode != null) 
            operNode.setDepth(depth+1);
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public ParseTreeOperatorEnum getContentOper() {
        return contentOper;
    }

    public void setContentOper(ParseTreeOperatorEnum contentOper) {
        this.contentOper = contentOper;
    }

    public ParseTreeOperatorNode getOperNode() {
        return operNode;
    }

    public void setOperNode(ParseTreeOperatorNode operNode) {
        this.operNode = operNode;
    }

    public Integer getDepth() {
        return depth;
    }

    public void setDepth(Integer depth) {
        this.depth = depth;
        sortDepth();
    }
    
    

    @Override
    public boolean compute(String str) {
        if (null != content && content.trim().length()>0) {         // content不为空，叶子节点；直接判断传入参数与content是否匹配
            //boolean match =  (str.toUpperCase().contains(this.content.toUpperCase()));
//            System.err.println(" Match Content = "+content+"  diag = "+str);
            content = content.replace("(", "\\(").replace(")", "\\)");
            boolean match =  str.matches(content);
            switch (this.contentOper) {
                case MATCH:
                    return match;
                    //break;
                case NOTMATCH:
                    return !match;
                    //break;
                default:
                    throw new RuntimeException("不支持的操作！"+this.toString());
            }
        }
        else {
            try {
                boolean match = this.operNode.compute(str);
                switch (this.contentOper) {
                    case MATCH:
                        return match;
                        //break;
                    case NOTMATCH:
                        return !match;
                        //break;
                    default:
                        throw new RuntimeException("不支持的操作！");
                }
            }
            catch(Exception e) {
                System.err.println(" Compute ERROR!!!!!!" + e);
                e.printStackTrace();
                throw new RuntimeException(" 程序异常，需要进一步调试!!!");
            }
        }
    }

    @Override
    public String toString() {
        StringBuilder str = new StringBuilder("");
        for (int i=0;i<=depth;i++) {
            str.append("->\t");
        }
        str.append(":ResultNode{");
        if (this.content != null) {
            str.append(" content = "+this.content + "  content operator ="+this.contentOper);
        }
        str.append("}");
        if (this.operNode != null) {
            str.append("\n");
            str.append(this.operNode.toString());
        }
        str.append("\n");
        return str.toString();
    }
    
    
    
}
