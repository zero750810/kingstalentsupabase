<template>
    <div style="height: 98vh;">
        <button class="btn btn-primary" @click="loadData('crm')">客戶管理</button>
        <button class="btn btn-primary" @click="loadData('event')">課程安排</button>
        <button class="btn btn-primary" @click="loadData('inventory')">庫存管理</button>
        <button class="btn btn-primary" @click="loadData('LessonPlans')">課程管理</button><br>
        <div ref="table" style="height: 90vh;"></div>

        <!-- Modal -->
        <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="myModalLabel">編輯</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-check" v-for="(option, index) in lessonPlanOptions" :key="index">
                            <input class="form-check-input" type="checkbox" :value="option.value"
                                v-model="selectedLessonPlans" :id="'checkbox-' + index">
                            <label class="form-check-label" :for="'checkbox-' + index">
                                {{ option.text }}
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="confirmEdit">確定</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { mapState } from 'vuex';
import 'tabulator-tables/dist/css/tabulator.min.css'; // 根據需要調整路徑
import { supabase } from '@/supabase';

export default {
    data() {
        return {
            collection: '',
            selectedLessonPlans: [],
            lessonPlanOptions: [],
            currentCell: null, // 用於存儲當前正在編輯的單元格
        };
    },
    methods: {
        loadData(collection) {
            // 清除現有的頭部過濾器狀態
            this.tabulator.clearHeaderFilter();
            this.tabulator.clearData();
            this.tabulator.setGroupBy();
            this.collection = collection;
            // 為不同的collection定義統一的列設置邏輯
            let columns = this.getColumnSettings(collection);
            this.tabulator.setColumns(columns);
            this.tabulator.setData(this[collection]);
            console.log(collection)
            // 對特定的collection設置排序和過濾
            this.setCollectionSpecificSettings(collection);
        },
        getColumnSettings(collection) {
            switch (collection) {
                case 'crm':
                    return this.getCRMColumns();
                case 'event':
                    return this.getEventColumns();
                case 'inventory':
                    return this.getInventoryColumns();
                case 'LessonPlans':
                    return this.getLessonPlansColumns();
                default:
                    return [];
            }
        },
        setCollectionSpecificSettings(collection) {
            const sortSettings = {
                'event': [
                
                    { column: "start_time", dir: "asc" },
                    { column: "date", dir: "asc" },
                    { column: "course", dir: "asc" },
                    { column: "crmid", dir: "asc" },
                    { column: "area", dir: "asc" }
                ],
                'crm': [
                    { column: "name", dir: "asc" },
                    { column: "area", dir: "asc" }
                ],
                'inventory': [
                    { column: "name", dir: "asc" },
                    { column: "course", dir: "asc" }
                ],
                'LessonPlans': [
                    { column: "name", dir: "asc" },
                    { column: "course", dir: "asc" }
                ]
            };
            if (collection === 'event') {
                let categoryValues = Object.values(this.categoryOptions);
                let maxCategoryOption = categoryValues.sort()[categoryValues.length - 1];
                this.tabulator.setHeaderFilterValue("course_time", maxCategoryOption);
            }
            if (sortSettings[collection]) {
                this.tabulator.setSort(sortSettings[collection]);
            }
        },
        getCRMColumns() {
            return [
                {
                    title: "客戶名稱",
                    field: "name",
                    editor: "input",
                    widthGrow: 1,
                    headerFilter: "input", vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "crm";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this),
                },
                {
                    title: "地址",
                    field: "add",
                    editor: "input",
                    widthGrow: 2, vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "crm";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "地區", field: "area", editor: "list", hozAlign: "center", vertAlign: "middle",
                    editorParams: { values: this.areaOptions },
                    headerFilter: "list",
                    headerFilterParams: { values: this.areaOptions },
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "crm";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "客戶等級", field: "lv", editor: "list", widthGrow: 1, vertAlign: "middle",
                    editorParams: { values: this.lvOptions },
                    headerFilter: "list",
                    headerFilterParams: { values: this.lvOptions },
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "crm";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "當前進度", field: "schedule", editor: "list", hozAlign: "center", vertAlign: "middle",
                    editorParams: { values: this.progressOptions },
                    headerFilter: "list",
                    headerFilterParams: { values: this.progressOptions },
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "crm";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "聯絡人", field: "client_name", editor: "input", hozAlign: "center", vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "crm";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "電話", field: "client_phone", editor: "input", hozAlign: "center", vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "crm";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "mail", field: "client_mail", editor: "input", widthGrow: 2, hozAlign: "center", vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "crm";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "負責業務",
                    field: "sales",
                    editor: "list", hozAlign: "center", vertAlign: "middle",
                    editorParams: {
                        valuesLookup: (cell) => {
                            // 這裡，我們根據其他單元格的值來篩選 'Teachers' 數組
                            const area = cell.getRow().getCell("area").getValue();
                            const talent = "業務";
                            // 篩選符合條件的老師
                            const filteredTeachers = this.Teachers.filter(teacher =>
                                (Array.isArray(teacher.area) && teacher.area.includes(area)) &&
                                (Array.isArray(teacher.course) && teacher.course.includes(talent))
                            );
                            // 轉換為 Tabulator 需要的 {label, value} 格式
                            return filteredTeachers.map(teacher => ({
                                label: teacher.name,
                                value: teacher.id
                            }));
                        }
                    },
                    formatter: (cell) => this.NameFormatter(cell, 'Teachers', 'name'),
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "crm";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this) // 使用 .bind(this) 確保在回調函數中 this 指向 Vue 組件實例
                },
                {
                    title: "刪除",
                    field: "delete",
                    hozAlign: "center", hozAlign: "center", vertAlign: "middle",
                    formatter: (cell) => {
                        let button = document.createElement("button");
                        button.textContent = "刪除";
                        button.style.padding = "4px 10px";
                        button.style.cursor = "pointer";
                        button.onclick = () => {
                            if (confirm("確定要刪除這條記錄嗎？")) {
                                const docId = cell.getRow().getData().id;
                                const collectionName = "crm";
                                const newValue = true;
                                const field = "delect";
                                cell.getRow().delete();
                                this.saveDataToFirestore(docId, field, newValue, collectionName);
                            }
                        };
                        return button;
                    },
                },
            ];
        },
        getEventColumns() {
            return [
                {
                    title: "課程檔期",
                    field: "course_time",
                    headerFilter: "list", hozAlign: "center", vertAlign: "middle",
                    headerFilterParams: { values: this.categoryOptions }
                },
                {
                    title: "客戶名稱",
                    field: "crmid",
                    widthGrow: 2, vertAlign: "middle",
                    formatter: (cell) => this.NameFormatter(cell, 'crm', 'name'),
                    headerFilter: "input",
                },
                {
                    title: "地區", field: "area",
                    headerFilter: "list", hozAlign: "center", vertAlign: "middle",
                    headerFilterParams: { values: this.areaOptions }
                },
                {
                    title: "才藝", field: "course", editor: "list",
                    editorParams: { values: this.talentOptions },
                    headerFilter: "list", hozAlign: "center", vertAlign: "middle",
                    headerFilterParams: { values: this.talentOptions },
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "event";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "鐘點", field: "hourly_rate", editor: "number", hozAlign: "center", vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "event";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "材料", field: "material_fee", editor: "number", hozAlign: "center", vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "event";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "預估", field: "estimated_number", editor: "number", hozAlign: "center", vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "event";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "課程日期", field: "date", editor: "date", hozAlign: "center", vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "event";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "開始", field: "start_time", editor: "time", hozAlign: "center", vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "event";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "結束", field: "end_time", editor: "time", hozAlign: "center", vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "event";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "時數", field: "hour", editor: "number", hozAlign: "center", vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "event";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "授課老師",
                    field: "teacherid",
                    editor: "list", hozAlign: "center", vertAlign: "middle",
                    editorParams: {
                        valuesLookup: (cell) => {
                            // 這裡，我們根據其他單元格的值來篩選 Teachers' 數組
                            const area = cell.getRow().getCell("area").getValue();
                            const talent = cell.getRow().getCell("course").getValue();
                            console.log("area", area, "talent", talent, "this.Teachers", this.Teachers)
                            // 篩選符合條件的老師
                            const filteredTeachers = this.Teachers.filter(teacher =>
                                (Array.isArray(teacher.area) && teacher.area.includes(area)) &&
                                (Array.isArray(teacher.course) && teacher.course.includes(talent))
                            );
                            console.log("filteredTeachers", filteredTeachers)
                            // 轉換為 Tabulator 需要的 {label, value} 格式
                            return filteredTeachers.map(teacher => ({
                                label: teacher.name,
                                value: teacher.id
                            }));
                        }
                    },
                    formatter: (cell) => this.NameFormatter(cell, 'Teachers', 'name'),
                },
                {
                    title: "課程內容",
                    field: "course_titleid", editor: "list", hozAlign: "center", vertAlign: "middle",
                    editorParams: {
                        valuesLookup: (cell) => {
                            // 這裡，我們根據其他單元格的值來篩選 LessonPlans 數組
                            const talent = cell.getRow().getCell("course").getValue();
                            // 篩選符合條件的課程計劃
                            const filteredLessonPlans = this.LessonPlans.filter(lessonPlan =>
                                lessonPlan.course === talent
                            );
                            console.log("talent", talent);
                            console.log("this.LessonPlans", this.LessonPlans);
                            console.log("filteredLessonPlans", filteredLessonPlans);
                            // 轉換為 Tabulator 需要的 {label, value} 格式
                            return filteredLessonPlans.map(lessonPlan => ({
                                label: lessonPlan.name,
                                value: lessonPlan.id
                            }));
                        }
                    },
                    formatter: (cell) => this.NameFormatter(cell, 'LessonPlans', 'name'),
                },
                {
                    title: "課程備註", field: "remark", editor: "input",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "event";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "型態", field: "type", editor: "list", hozAlign: "center", vertAlign: "middle",
                    editorParams: {
                        values: ["常態", "營隊", "社團"]
                    },
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "event";
                        // 將改變保存到後端
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "材料數量", field: "people_number", editor: "number", hozAlign: "center", vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "event";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "刪除",
                    field: "delete",
                    hozAlign: "center", hozAlign: "center", vertAlign: "middle",
                    formatter: (cell) => {
                        let button = document.createElement("button");
                        button.textContent = "刪除";
                        button.style.padding = "4px 10px";
                        button.style.cursor = "pointer";
                        button.onclick = () => {
                            if (confirm("確定要刪除這條記錄嗎？")) {
                                const docId = cell.getRow().getData().id;
                                const collectionName = "event";
                                const newValue = true;
                                const field = "delect";
                                cell.getRow().delete();
                                this.saveDataToFirestore(docId, field, newValue, collectionName);

                            }
                        };
                        return button;
                    },
                },
            ];
        },
        getInventoryColumns() {
            return [
                { title: "材料名稱", field: "name", headerFilter: "input", hozAlign: "center", vertAlign: "middle" },
                {
                    title: "照片",
                    field: "photo", hozAlign: "center", vertAlign: "middle",
                    formatter: (cell) => {
                        // 獲取單元格的值，即圖片的URL
                        const imageUrl = cell.getValue();
                        // 創建一個img元素
                        const imageElement = document.createElement("img");
                        // 設置img元素的src屬性為圖片的URL
                        imageElement.src = imageUrl;
                        // 設置圖片的寬度和高度
                        imageElement.style.width = "100px"; // 示例寬度
                        imageElement.style.height = "80px"; // 示例高度
                        // 為了更好的佈局和顯示，可以設置圖片為居中顯示
                        imageElement.style.objectFit = "cover";
                        // 返回img元素
                        return imageElement;
                    },
                    // 設置列的寬度，以適應圖片的顯示
                    width: 110,
                    // 根據需要調整垂直對齊方式
                    vertAlign: "middle",
                },
                {
                    title: "道具分類", field: "course", headerFilter: "list", hozAlign: "center", vertAlign: "middle",
                    headerFilterParams: {
                        values: this.talentOptions,
                        cellEdited: function (cell) {
                            // 獲取新值和文檔 ID
                            const newValue = cell.getValue();
                            const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                            const collectionName = "inventory";
                            // 調用函數保存數據到 Firestore
                            this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                        }.bind(this)
                    },
                },
                {
                    title: "規格(以,做分隔)", field: "Specification", editor: "input", hozAlign: "center", vertAlign: "middle", cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        // 獲取新值並將其以逗號分隔轉換成數組
                        const newValue = cell.getValue().split(',').map(item => item.trim());  // 刪除每個元素周圍的空格
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "inventory";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "單位", field: "unit", editor: "input", hozAlign: "center", vertAlign: "middle", cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "inventory";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "最大庫存量", field: "max_ stock", editor: "number", hozAlign: "center", vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "inventory";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "總部庫存量", field: "0_ stock", editor: "number", hozAlign: "center", vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "inventory";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "北區庫存量", field: "1_ stock", editor: "number",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "inventory";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "桃竹庫存量", field: "2_ stock", editor: "number", hozAlign: "center", vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "inventory";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "中區庫存量", field: "3_ stock", editor: "number", hozAlign: "center", vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "inventory";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                {
                    title: "南區庫存量", field: "4_ stock", editor: "number", hozAlign: "center", vertAlign: "middle",
                    cellEdited: function (cell) {
                        // 獲取新值和文檔 ID
                        const newValue = cell.getValue();
                        const docId = cell.getRow().getData().id; // 假設每行數據都有一個 'id' 字段
                        const collectionName = "inventory";
                        // 調用函數保存數據到 Firestore
                        this.saveDataToFirestore(docId, cell.getField(), newValue, collectionName);
                    }.bind(this)
                },
                { title: "成本", field: "cost", hozAlign: "center", vertAlign: "middle" },
                {
                    title: "刪除",
                    field: "delete",
                    hozAlign: "center", hozAlign: "center", vertAlign: "middle",
                    formatter: (cell) => {
                        let button = document.createElement("button");
                        button.textContent = "刪除";
                        button.style.padding = "4px 10px";
                        button.style.cursor = "pointer";

                        button.onclick = () => {
                            if (confirm("確定要刪除這條記錄嗎？")) {
                                const docId = cell.getRow().getData().id;
                                const collectionName = "inventory";
                                const newValue = true;
                                const field = "delect";
                                cell.getRow().delete();
                                this.saveDataToFirestore(docId, field, newValue, collectionName);

                            }
                        };
                        return button;
                    },
                },
            ];
        },
        getLessonPlansColumns() {
            return [
                { title: "課程名稱", field: "name", headerFilter: "input", hozAlign: "center", vertAlign: "middle" },
                {
                    title: "才藝分類", field: "course", headerFilter: "list", hozAlign: "center", vertAlign: "middle",
                    headerFilterParams: { values: this.talentOptions },
                },
                {
                    title: "使用材料", field: "material", hozAlign: "center", vertAlign: "middle",
                    cellClick: (e, cell) => {
                        this.customEditor(cell, {
                            arrayName: 'inventory',
                            field1: 'course',
                            compareField1: 'course',
                            displayField: 'name'
                        });
                    },
                    formatter: (cell) => this.NameFormatter(cell, 'inventory', 'name'),
                },
                { title: "課程說明", field: "detail", hozAlign: "center", vertAlign: "middle", },
                { title: "影片連結", field: "video_link", hozAlign: "center", vertAlign: "middle", },
                {
                    title: "刪除",
                    field: "delect", hozAlign: "center", vertAlign: "middle",
                    formatter: (cell) => {
                        let button = document.createElement("button");
                        button.textContent = "刪除";
                        button.style.padding = "4px 10px";
                        button.style.cursor = "pointer";
                        button.onclick = () => {
                            if (confirm("確定要刪除這條記錄嗎？")) {
                                const docId = cell.getRow().getData().id;
                                const collectionName = "inventory";
                                const newValue = true;
                                const field = "delect";
                                cell.getRow().delete();
                                this.saveDataToFirestore(docId, field, newValue, collectionName);

                            }
                        };
                        return button;
                    },
                },
            ];
        },

        // 自定義格式化器
        NameFormatter(cell, searchArrayName, displayFieldName) {
            const value = cell.getValue();
            const searchArray = this[searchArrayName];
            // 檢查searchArray是否有效
            if (!searchArray || !Array.isArray(searchArray)) {
                console.error(`Search array ${searchArrayName} is not valid.`);
                return "數據加載中或不可用"; // 返回一個錯誤信息或者默認文本
            }
            // 檢查傳入的值是否為數組
            if (Array.isArray(value)) {
                // 處理數組中的每個元素
                return value.map(id => {
                    const item = searchArray.find(item => String(item.id) === id);
                    return item ? item[displayFieldName] : id + "*";
                }).join(", "); // 將結果連接成一個字符串，每個值之間用逗號分隔
            } else {
                // 處理單個字符串ID
                const item = searchArray.find(item => item.id === value);
                return item ? item[displayFieldName] : value + "*";
            }
        },

        getOptions(fieldName) {
            const options = this.$store.state.data.set[0];
            const resultOptions = {};
            if (options && options[fieldName]) {
                options[fieldName].forEach(item => {
                    resultOptions[item] = item; // 鍵和值相同
                });
            }
            return resultOptions;
        },

        //儲存資料
        async saveDataToFirestore(docId, field, newValue, collectionName) {
            // 獲取 Supabase 客戶端實例
            const { data, error } = await supabase
                .from(collectionName)
                .update({ [field]: newValue, created_at: new Date().toISOString() })
                .match({ id: docId });

            if (error) {
                console.error("Error updating document: ", error);
            } else {
                const newData = {};
                newData[field] = newValue;
                // 如果是刪除操作
                if (field === 'delect' && newValue === true) {
                    this.$store.commit('deleteData', { collectionName, docId });
                } else {
                    // 調用 mutation 更新 Vuex 中的數據
                    this.$store.commit('updateData', { collectionName, docId, newData });
                }
            }
        },
        //多選選單
        customEditor(cell, { arrayName, field1, compareField1, displayField }) {
            this.currentCell = { cell }; // 存儲當前單元格信息以便稍後使用
            console.log("Current cell:", this.currentCell); // 打印當前單元格信息
            const filterValue = cell.getRow().getData()[field1]; // 獲取當前行特定字段的值
            console.log("Filter value:", filterValue); // 打印過濾值
            // 初始化多選框的選中項，確保它是一個數組
            this.selectedLessonPlans = Array.isArray(cell.getValue()) ? cell.getValue() : [];
            console.log("Selected lesson plans:", this.selectedLessonPlans); // 打印已選課程計劃
            // 從數據源中篩選選項
            let options = this[arrayName]
                .filter(item => item[compareField1] === filterValue) // 根據compareField1字段進行篩選
                .map(item => ({
                    value: item.id,
                    text: item[displayField],
                }));
            // 確保當前單元格的值包含在選項中
            const currentValues = Array.isArray(cell.getValue()) ? cell.getValue() : [];
            currentValues.forEach(currentValue => {
                if (currentValue && !options.some(option => option.value === currentValue)) {
                    // 如果當前單元格的某個值不存在於選項中，則添加它
                    const currentOption = this[arrayName].find(item => item.id === currentValue);
                    if (currentOption) {
                        options.unshift({ // 在數組開頭添加當前值
                            value: currentOption.id,
                            text: currentOption[displayField],
                        });
                    } else {
                        // 如果在源數組中也找不到，就直接使用當前值
                        options.unshift({
                            value: currentValue,
                            text: currentValue + "*" // 如果沒有對應的顯示字段，使用值本身
                        });
                    }
                }
            });
            // 對選項進行排序
            options.sort((a, b) => a.text.localeCompare(b.text));
            this.lessonPlanOptions = options;
            this.$refs.myModal.show(); // 顯示模態窗口
        },
        //多選表單
        confirmEdit() {
            if (this.currentCell && this.currentCell.cell) {
                // 保存數據到 Firestore，並不依賴 this.currentCell.success
                const cell = this.currentCell.cell; // 獲取當前的單元格
                const newValue = this.selectedLessonPlans; // 從模態窗口獲取新值
                const docId = cell.getRow().getData().id; // 獲取文檔ID
                const fieldName = cell.getField(); // 獲取字段名稱
                this.saveDataToFirestore(docId, fieldName, newValue, this.collection);
                // 更新單元格顯示的值，如果需要的話
                cell.setValue(newValue, true); // 第二個參數true表示不觸發cellEdited回調
                this.$refs.myModal.hide(); // 隱藏模態窗口
                this.currentCell = null; // 清除存儲的單元格信息
            }
        },

    },
    mounted() {
        this.tabulator = new Tabulator(this.$refs.table, {
            layout: "fitDataTable",
        });

    },
    computed: {
        ...mapState({
            crm: state => Object.values(state.data.crm),
            event: state => Object.values(state.data.event),
            Teachers: state => Object.values(state.data.teacher),
            inventory: state => Object.values(state.data.inventory),
            LessonPlans: state => Object.values(state.data.lesson_plans),
            // 其他需要的數據...
        }),
        areaOptions() {
            return this.getOptions('area');
        },
        lvOptions() {
            return this.getOptions('lv');
        },
        progressOptions() {
            return this.getOptions('schedule');
        },
        talentOptions() {
            return this.getOptions('course');
        },
        categoryOptions() {
            return this.getOptions('course_time');
        }
    }

}
</script>
<style scoped>
/* 在這裡添加你的 CSS 樣式 */
</style>
