/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.util;

/**
 *
 * @author changzhenghe
 * 分类轴心定义
 */
public enum CategoryAxis {
    NOXA,                                   // 病因
    ANATOMIC_SITE,                          // 解剖部位
    CLINICAL_MANIFESTATION,                 // 临床表现
    CM_SYMPTOM,                             // 临床表现-症状
    CM_SIGN,                                // 临床表现-体征
    CM_PERIOD,                              // 临床表现-分期
    CM_TYPE,                                // 临床表现-分型
    CM_SEX,                                 // 临床表现-性别
    CM_ACUTE_CHRONIC,                       // 临床表现-急慢性
    CM_OCCUR_TIME,                          // 临床表现-发病时间
    PATHOLOGY                               // 病理
    
}
