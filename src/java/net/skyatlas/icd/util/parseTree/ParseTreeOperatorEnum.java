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
public enum ParseTreeOperatorEnum {
    LOGIC_AND,                                // 逻辑与
    LOGIC_OR,                                 // 逻辑或
    LOGIC_NOT,                                 // 逻辑非
    MATCH,                                      // 字符串匹配
    NOTMATCH                                    // 字符串不匹配
}
