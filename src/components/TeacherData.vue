<template>
    <div>
        <div class="col-12 row mb-2">
            <!-- 地區選擇下拉菜單 -->
            <div class="col-2">
                <select class="form-select" v-model="currentArea">
                    <option value="all">所有地區</option>
                    <option v-for="area in areas" :key="area" :value="area">
                        {{ area }}
                    </option>
                </select>
            </div>

            <!-- 課程選擇下拉菜單 -->
            <div class="col-2">
                <select class="form-select" v-model="currentCourse">
                    <option value="all">所有課程</option>
                    <option v-for="course in courses" :key="course" :value="course">
                        {{ course }}
                    </option>
                </select>
            </div>

            <!-- 搜索欄 -->
            <div class="col-4">
                <input type="text" class="form-control" v-model="searchQuery" placeholder="搜索教師名字或別名"
                    @input="filterTeachers">
            </div>
        </div>



        <div class="container-fluid row">
            <div class="col-8 overflow-y-auto">
                <div class="btn-group" aria-label="Region buttons" id="regionsContainer"></div>
                <div class="container-fluid">
                    <div class="col-12">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" v-for="field in fields" :key="field.key"
                                        :style="{ width: field.width }">{{ field.label }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="teacher in filteredTeachers" :key="teacher.id"
                                    @click="selectTeacher(teacher)">
                                    <td v-for="field in fields" :key="field.key">{{ teacher[field.key] }}</td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
            <div class="col-4 overflow-y-auto" id="teacherDetails">
                <div v-if="selectedTeacherDetails">
                    <h6>地區:</h6>
                    <h4>{{ selectedTeacherDetails.area }}</h4>
                    <h6>電子信箱:</h6>
                    <h4>{{ selectedTeacherDetails.mail }}</h4>
                    <h6>出生年月:</h6>
                    <h4>{{ selectedTeacherDetails.birthday }}</h4>
                    <h6>身分證字號:</h6>
                    <h4>{{ selectedTeacherDetails.idcard }}</h4>
                    <h6>戶籍地址:</h6>
                    <h4>{{ selectedTeacherDetails.registration_add }}</h4>
                    <h6>居住地址:</h6>
                    <h4>{{ selectedTeacherDetails.live_add }}</h4>
                    <h6>匯款代號 / 帳號:</h6>
                    <h4>{{ selectedTeacherDetails.bank_code }} / {{ selectedTeacherDetails.bank_account }}</h4>
                    <h6>立帳分行:</h6>
                    <h4>{{ selectedTeacherDetails.bank_name }}</h4>
                    <h6>團隊名稱:</h6>
                    <h4>{{ selectedTeacherDetails.team }}</h4>
                    <h6>帳戶影本:</h6><img :src="selectedTeacherDetails.bank_ph" class="img-thumbnail" />
                    <h6>身分證正面:</h6><img :src="selectedTeacherDetails.idc_ph" class="img-thumbnail" />
                    <h6>身分證反面:</h6><img :src="selectedTeacherDetails.idc_ph1" class="img-thumbnail" />
                    <h6>業務簽名:</h6><img :src="selectedTeacherDetails.sales_ph" class="img-thumbnail" />
                </div>
                <div v-else>
                    <p>請從左側列表中選擇一個教師以查看詳情。</p>
                </div>
            </div>
            <button class="btn btn-primary rounded-circle"
                style="position: fixed; bottom: 70px; right: 50px; width: 4rem; height: 4rem; display: flex; justify-content: center; align-items: center;"
                @click="openModal('edit')">
                <!-- Use SVG or Font Awesome for pencil icon -->
            </button>
        </div>

        <!-- Bootstrap 5 modal -->
        <div class="modal fade" id="teacherModal" tabindex="-1" aria-hidden="true" v-show="isModalOpen">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="teacherModalLabel">新增教師</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveTeacher">
                            <div class="row">
                                <div class="col-8 overflow-y-auto">
                                    <div class="row">
                                        <!-- 區域 1 -->
                                        <div class="col-6">
                                            <div v-for="(group, index) in formGroup1" :key="`group1-${index}`"
                                                class="mb-3">
                                                <div class="row">
                                                    <div class="col-auto">
                                                        <label :for="`teacher${index}`" class="col-form-label">{{
                    group.label }}</label>
                                                    </div>
                                                    <div class="col-sm-8">
                                                        <input :type="group.type || 'text'" class="form-control"
                                                            :id="`teacher${index}`" :placeholder="group.placeholder"
                                                            v-model="teacherForm[group.model]"
                                                            :readonly="group.readonly || false" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- 區域 2 -->
                                        <div class="col-6">
                                            <div v-for="(group, index) in formGroup2" :key="`group2-${index}`"
                                                class="mb-3">
                                                <div class="row">
                                                    <div class="col-auto">
                                                        <label :for="`teacher${index + formGroup1.length}`"
                                                            class="col-form-label">{{ group.label }}</label>
                                                    </div>
                                                    <div class="col-8">
                                                        <input :type="group.type || 'text'" class="form-control"
                                                            :id="`teacher${index + formGroup1.length}`"
                                                            :placeholder="group.placeholder"
                                                            v-model="teacherForm[group.model]"
                                                            :readonly="group.readonly || false" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 區域 3 -->
                                    <div>
                                        <label>地區：</label>
                                        <div class="d-flex flex-wrap">
                                            <div v-for="area in areas" :key="area" class="form-check form-check-inline">
                                                <input type="checkbox" :id="`area-${area}`" class="form-check-input"
                                                    v-model="selectedTeacherAreas" :value="area">
                                                <label :for="`area-${area}`" class="form-check-label">{{ area }}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label>課程：</label>
                                        <div class="d-flex flex-wrap">
                                            <div v-for="course in courses" :key="course"
                                                mclass="form-check form-check-inline">
                                                <input type="checkbox" :id="`course-${course}`" class="form-check-input"
                                                    v-model="selectedTeacherCourses" :value="course">
                                                <label :for="`course-${course}`" class="form-check-label">{{
                    course }}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 區域 4 -->
                                <div class="col-4  overflow-y-auto">
                                    <div v-for="(group, index) in formGroup4" :key="`group4-${index}`" class="mb-3">
                                        <label :for="`teacher${index + formGroup1.length + formGroup2.length}`">{{
                    group.label }}</label>
                                        <input :type="group.type || 'text'" class="form-control"
                                            :id="`teacher${index + formGroup1.length + formGroup2.length}`"
                                            :placeholder="group.placeholder" v-model="teacherForm[group.model]"
                                            :readonly="group.readonly || false" />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                        <button type="submit" class="btn btn-primary" @click="saveTeacherData">保存</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex'; // 引入 useStore 函數用於訪問 Vuex store
import { Modal } from 'bootstrap';
import { supabase } from '@/supabase';

const store = useStore();  // 使用 Vuex store

const currentArea = ref('all');
const currentCourse = ref('all');
const searchQuery = ref('');

const savingError = ref(null);
const selectedTeacherAreas = ref([]);
const selectedTeacherCourses = ref([]);
///資料獲取///
const areas = computed(() => store.state.data.set[0].area);
const courses = computed(() => store.state.data.set[0].course);

const filteredTeachers = computed(() => {
    return Object.values(store.state.data.teacher).filter(teacher => {
        // 地區過濾
        const isAreaMatch = currentArea.value === 'all' || (teacher.area && teacher.area.includes(currentArea.value));
        // 課程過濾
        const isCourseMatch = currentCourse.value === 'all' || (teacher.course && teacher.course.includes(currentCourse.value));
        // 名稱和別名過濾
        const isNameMatch = searchQuery.value === '' ||
            (teacher.name && teacher.name.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
            (teacher.Alias && teacher.Alias.toLowerCase().includes(searchQuery.value.toLowerCase()));


        return isAreaMatch && isCourseMatch && isNameMatch;
    })
    .map(teacher => ({
        ...teacher,
        nameAlias: teacher.Alias ? `${teacher.name} (${teacher.Alias})` : `${teacher.name}`,
        phoneLineID: teacher.LineID ? `${teacher.phone} / ${teacher.LineID}` : `${teacher.phone}`
    }));
});





///動態表單
const fields = ref([
    { key: 'nameAlias', label: '姓名 (別名)', width: '15%' }, // 使用新的合併字段
    { key: 'pay', label: '薪資', width: '10%' },
    { key: 'phoneLineID', label: '聯繫電話 / Line ID', width: '30%' }, // 使用新的合併字段
    { key: 'course', label: '教授課程', width: '45%' }
]);
const formGroup1 = ref([
    { label: '身份 ID', model: 'id', placeholder: '自動生成的ID', readonly: true },
    { label: '老師姓名', model: 'name', placeholder: '老師姓名' },
    { label: '老師綽號', model: 'Alias', placeholder: '老師綽號' },
    { label: '出生年月', model: 'birthday', placeholder: '出生年月日' },
    { label: '身份證號', model: 'idcard', placeholder: '身分證字號' },
    { label: '電子信箱', model: 'mail', placeholder: '老師綽號', readonly: true },
    { label: 'Line ID', model: 'LineID', placeholder: '' },
    { label: '老師薪資', model: 'pay', placeholder: '' },
]);

const formGroup2 = ref([
    { label: '聯絡電話', model: 'phone', placeholder: '聯絡電話' },
    { label: '戶籍地址', model: 'registration_add', placeholder: '戶籍地址' },
    { label: '居住地址', model: 'live_add', placeholder: '居住地址' },
    { label: '銀行代碼', model: 'bank_code', placeholder: '銀行代碼' },
    { label: '匯款賬號', model: 'bank_account', placeholder: '匯款賬號' },
    { label: '立帳分行', model: 'bank_name', placeholder: '立帳分行' },
    { label: '團隊名稱', model: 'team', placeholder: '個人免填' },
    { label: '老師權限', model: 'role', placeholder: '老師綽號' },
]);

const formGroup4 = ref([
    { label: '老師綽號', model: '綽號', placeholder: '老師綽號' },
]);

const teacherForm = ref({
    id: '', // 身份 ID，編輯時會被填充
    name: '', // 老師姓名
    Alias: '', // 老師綽號
    birthday: '', // 出生年月
    idcard: '', // 身份證號
    mail: '', // 電子郵箱
    LineID: '', // Line ID
    pay: '', // 老師薪資
    phone: '', // 聯絡電話
    registration_add: '', // 戶籍地址
    live_add: '', // 居住地址
    bank_code: '', // 銀行代碼
    bank_account: '', // 匯款賬號
    bank_name: '', // 立帳分行
    team: '', // 團隊名稱
    role: '', // 老師權限
    // 其他字段...
});

const saveTeacher = () => {
    // Add your save teacher logic here
};



const selectedTeacherDetails = ref(null); // 選擇的教師詳情

// 選擇教師的方法
const selectTeacher = (teacher) => {
    selectedTeacherDetails.value = teacher;
    teacherForm.value = { ...teacher }; // 將選中的教師信息賦值給表單
    selectedTeacherAreas.value = teacher.area || []; // 更新多選框的選中狀態
    selectedTeacherCourses.value = teacher.course || []; // 更新多選框的選中狀態
};

//model相關
const modalElement = ref(null);  // 用於引用模態框的DOM元素
const isModalOpen = ref(false); // 用於控制模態框是否顯示
const modalMode = ref('');  // 添加這行定義模態框模式的變量
const openModal = (mode) => {
    if (mode === 'edit' && !selectedTeacherDetails.value) {
        alert("請點擊要變更老師的內容");
        return;
    }
    modalMode.value = mode;
    if (!modalElement.value) {
        // 這裡假設你的模態框ID為'teacherModal'
        modalElement.value = new Modal(document.getElementById('teacherModal'));
    }
    modalElement.value.show();
};

const saveTeacherData = async () => {
    try {
        // 將選擇的地區和課程從對象轉換為數組
        let { data, error } = await supabase
            .from('teacher')
            .upsert({
                id: teacherForm.value.id, // 確保你的表格有一個'id'字段
                name: teacherForm.value.name,
                Alias: teacherForm.value.Alias,
                birthday: teacherForm.value.birthday,
                idcard: teacherForm.value.idcard,
                mail: teacherForm.value.mail,
                area: selectedTeacherAreas.value,
                course: selectedTeacherCourses.value,
                phone: teacherForm.value.phone,
                LineID: teacherForm.value.LineID,
                registration_add: teacherForm.value.registration_add,
                live_add: teacherForm.value.live_add,
                bank_code: teacherForm.value.bank_code,
                bank_account: teacherForm.value.bank_account,
                bank_name: teacherForm.value.bank_name,
                team: teacherForm.value.team,
                created_at: new Date().toISOString()
            });
        if (error) throw error;
        await store.dispatch('fetchDataFromItems', ['teacher']);
        const updatedTeacher = store.state.data.teacher[teacherForm.value.id];
        selectTeacher(updatedTeacher);
        modalElement.value.hide();
    } catch (error) {
        console.error('保存教師數據出錯:', error);
        savingError.value = error;
        alert('保存教師數據出錯');
    }
};
</script>

<style scoped>
.overflow-y-auto {
    max-height: 92vh;
    /* 或者根據實際需要調整 */
    overflow-y: auto;
}
</style>