<template>
    <div style="width: 95%;">
        <form @submit.prevent="saveTeacher">
            <div class="row h-100">
                <!-- 區域 1 和區域 2 -->
                <div class="col-md-8 h-100 overflow-auto">
                    <div class="row">
                        <!-- 區域 1 -->
                        <div class="col-md-6">
                            <!-- 區域 1 的表單元素 -->
                            <div class="row g-3 align-items-center mb-3">
                                <div class="col-auto">
                                    <label for="teacher0" class="form-label">老師姓名</label>
                                </div>
                                <div class="col">
                                    <input id="teacher0" type="text" class="form-control" v-model="teacherForm.name"
                                        placeholder="老師姓名（對賬使用，請勿亂填）">
                                </div>
                            </div>
                            <div class="row g-3 align-items-center mb-3">
                                <div class="col-auto">
                                    <label for="teacher1" class="form-label">老師暱稱</label>
                                </div>
                                <div class="col">
                                    <input id="teacher1" type="text" class="form-control" v-model="teacherForm.Alias"
                                        placeholder="老師暱稱">
                                </div>
                            </div>
                            <div class="row g-3 align-items-center mb-3">
                                <div class="col-auto">
                                    <label for="teacher2" class="form-label">出生日期</label>
                                </div>
                                <div class="col">
                                    <input id="teacher2" type="date" class="form-control"
                                        v-model="teacherForm.birthday">
                                </div>
                            </div>
                            <div class="row g-3 align-items-center mb-3">
                                <div class="col-auto">
                                    <label for="teacher3" class="form-label">身份證號</label>
                                </div>
                                <div class="col">
                                    <input id="teacher3" type="text" class="form-control" v-model="teacherForm.idcard"
                                        placeholder="身份證號">
                                </div>
                            </div>
                            <div class="row g-3 align-items-center mb-3">
                                <div class="col-auto">
                                    <label for="teacher4" class="form-label">電子郵件</label>
                                </div>
                                <div class="col">
                                    <input id="teacher4" type="email" class="form-control" v-model="teacherForm.mail"
                                        placeholder="電子郵件">
                                </div>
                            </div>
                            <div class="row g-3 align-items-center mb-3">
                                <div class="col-auto">
                                    <label for="teacher18" class="form-label">Line ID</label>
                                </div>
                                <div class="col">
                                    <input id="teacher18" type="text" class="form-control" v-model="teacherForm.LineID"
                                        placeholder="Line ID">
                                </div>
                            </div>
                            <div class="row g-3 align-items-center mb-3">
                                <div class="col-auto">
                                    <label for="teacher7" class="form-label">聯繫電話</label>
                                </div>
                                <div class="col">
                                    <input id="teacher7" type="tel" class="form-control" v-model="teacherForm.phone"
                                        placeholder="聯繫電話">
                                </div>
                            </div>
                        </div>
                        <!-- 區域 2 -->
                        <div class="col-md-6">
                            <!-- 區域 2 的表單元素 -->
                            <div class="row g-3 align-items-center mb-3">
                                <div class="col-auto">
                                    <label for="teacher8" class="form-label">戶籍地址</label>
                                </div>
                                <div class="col">
                                    <input id="teacher8" type="text" class="form-control"
                                        v-model="teacherForm.registration_add" placeholder="戶籍地址">
                                </div>
                            </div>
                            <div class="row g-3 align-items-center mb-3">
                                <div class="col-auto">
                                    <label for="teacher9" class="form-label">居住地址</label>
                                </div>
                                <div class="col">
                                    <input id="teacher9" type="text" class="form-control" v-model="teacherForm.live_add"
                                        placeholder="居住地址">
                                </div>

                            </div>
                            <div class="row g-3 align-items-center mb-3">
                                <div class="col-auto">
                                    <label for="teacher10" class="form-label">銀行代號</label>
                                </div>
                                <div class="col">
                                    <input id="teacher10" type="text" class="form-control"
                                        v-model="teacherForm.bank_code" placeholder="銀行代號">
                                </div>

                            </div>
                            <div class="row g-3 align-items-center mb-3">
                                <div class="col-auto">
                                    <label for="teacher11" class="form-label">匯款賬號</label>
                                </div>
                                <div class="col">
                                    <input id="teacher11" type="text" class="form-control"
                                        v-model="teacherForm.bank_account" placeholder="匯款賬號">
                                </div>

                            </div>
                            <div class="row g-3 align-items-center mb-3">
                                <div class="col-auto">
                                    <label for="teacher12" class="form-label">立賬分行</label>
                                </div>
                                <div class="col">
                                    <input id="teacher12" type="text" class="form-control"
                                        v-model="teacherForm.bank_name" placeholder="立賬分行">
                                </div>

                            </div>
                            <div class="row g-3 align-items-center mb-3">
                                <div class="col-auto">
                                    <label for="teacher17" class="form-label">團隊名稱</label>
                                </div>
                                <div class="col">
                                    <input id="teacher17" type="text" class="form-control" v-model="teacherForm.team"
                                        placeholder="個人老師可跳過">
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 區域 3 -->
                    <div class="col">
                        <div class="mb-3">
                            <label class="form-label">地區</label>
                            <div class="row">
                                <div class="col-md-2" v-for="(area, index) in areas" :key="'area-' + index">
                                    <input :id="'area-' + index" type="checkbox" class="form-check-input"
                                        v-model="selectedAreas[area]">
                                    <label :for="'area-' + index" class="form-check-label">{{ area }}</label>
                                </div>
                            </div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">教授課程</label>
                            <div class="row">
                                <div class="col-md-2" v-for="(course, index) in courses" :key="'course-' + index">
                                    <input :id="'course-' + index" type="checkbox" class="form-check-input"
                                        v-model="selectedCourses[course]">
                                    <label :for="'course-' + index" class="form-check-label">{{ course }}</label>
                                </div>
                            </div>
                        </div>
                        <br>
                        <div class="text-center">
                            <div class="row justify-content-md-center">
                                <div class="col-md-auto">
                                    <div class="py-2">＊請填入及上傳正確信息，如因資料填寫錯誤造成會計無法對賬或是匯入薪資，請自行負責</div>
                                    
                                    <button @click="saveTeacherData" class="btn btn-primary">保存</button>
                                    <br> <br>
                                    <!-- 登出按鈕 -->
                                    <button @click="signOut" class="btn btn-danger">登出</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 h-100 overflow-auto">
                    <!-- Account photo -->
                    <div class="row g-3 align-items-center mb-3">
                        <div class="col-3">
                            <label for="teacher13" class="form-label">帐户影本</label>
                        </div>
                        <div class="col">
                            <input class="form-control" type="file" id="teacher13"
                                @change="handleFileUpload('bank_ph', this.teacherForm.id)">
                            <div v-if="teacherForm.bank_ph">
                                <button v-if="!showBankPhoto" @click="showBankPhoto = true">显示帐户影本</button>
                                <img v-if="showBankPhoto" :src="teacherForm.bank_ph" class="img-thumbnail" alt="帐户影本">
                            </div>
                            <div v-else>尚无上传</div>
                        </div>
                    </div>

                    <!-- ID card front -->
                    <div class="row g-3 align-items-center mb-3">
                        <div class="col-3">
                            <label for="teacher14" class="form-label">身份证正面影本</label>
                        </div>
                        <div class="col">
                            <input class="form-control" type="file" id="teacher14"
                                @change="handleFileUpload('idc_ph', this.teacherForm.id)">
                            <div v-if="teacherForm.idc_ph">
                                <button v-if="!showIdcPh" @click="showIdcPh = true">显示身份证正面影本</button>
                                <img v-if="showIdcPh" :src="teacherForm.idc_ph" class="img-thumbnail" alt="身份证正面影本">
                            </div>
                            <div v-else>尚无上传</div>
                        </div>
                    </div>

                    <!-- ID card back -->
                    <div class="row g-3 align-items-center mb-3">
                        <div class="col-3">
                            <label for="teacher15" class="form-label">身份证反面影本</label>
                        </div>
                        <div class="col">
                            <input class="form-control" type="file" id="teacher15"
                                @change="handleFileUpload('idc_ph1', this.teacherForm.id)">
                            <div v-if="teacherForm.idc_ph1">
                                <button v-if="!showIdcPh1" @click="showIdcPh1 = true">显示身份证反面影本</button>
                                <img v-if="showIdcPh1" :src="teacherForm.idc_ph1" class="img-thumbnail" alt="身份证反面影本">
                            </div>
                            <div v-else>尚无上传</div>
                        </div>
                    </div>

                    <!-- Signature -->
                    <div class="row g-3 align-items-center mb-3">
                        <div class="col-3">
                            <label for="teacher16" class="form-label">业务签名</label>
                        </div>
                        <div class="col">
                            <input class="form-control" type="file" id="teacher16"
                                @change="handleFileUpload('sales_ph', this.teacherForm.id)">
                            <div v-if="teacherForm.sales_ph">
                                <button v-if="!showSalesPh" @click="showSalesPh = true">显示业务签名</button>
                                <img v-if="showSalesPh" :src="teacherForm.sales_ph" class="img-thumbnail" alt="业务签名">
                            </div>
                            <div v-else>尚无上传</div>
                        </div>
                    </div>
                </div>

            </div>
        </form>
    </div>
</template>

<script>
import { supabase } from '@/supabase';
export default {
    data() {
        return {
            areas: [],
            courses: [],
            selectedAreas: {},  // 使用一個對象來保存選中狀態
            selectedCourses: {}, // 使用一個對象來保存選中狀態
            uploadProgress: {}, // 初始化 uploadProgress 对象
            showBankPhoto: false,
            showIdcPh: false,
            showIdcPh1: false,
            showSalesPh: false,
            teacherForm: {
                id: '',
                name: '',
                Alias: '',
                birthday: '',
                idcard: '',
                mail: '',
                area: '',
                course: '',
                phone: '',
                LineID: '',
                registration_add: '',
                live_add: '',
                bank_code: '',
                bank_account: '',
                bank_name: '',
                bank_ph: '',
                idc_ph: '',
                idc_ph1: '',
                sales_ph: '',
                team: '',
                created_at: '',
            },
            teacherData: [],
        };
    },
    mounted() {
        this.areas = this.$store.state.data.set[0].area || [];
        this.courses = this.$store.state.data.set[0].course || [];
        this.teacherData = this.$store.state.user;
        this.fetchAndFillData()
    },
    methods: {
        async signOut() {
            if (confirm("您确定要登出吗？")) {
                try {
                    const { error } = await supabase.auth.signOut();
                    if (error) throw error;
                    // 重置应用状态
                    //this.$store.commit('resetState');
                    console.log('登出成功');
                } catch (error) {
                    console.error('登出失败', error.message);
                }
            }
        },
        async fetchAndFillData() {
            try {
                // 假设 this.teacherData 已经是一个包含所有需要信息的对象
                const data = this.teacherData;
                console.log("data:", data)
                if (data) {
                    this.teacherForm = { ...this.teacherForm, ...data };
                    console.log(this.teacherForm)
                    this.resetMultiSelectModels(); // 重置多选模型
                    // 填充地區多选项
                    if (data.area && Array.isArray(data.area)) {
                        data.area.forEach(area => {
                            if (this.areas.includes(area)) { // 确保只处理存在的地区
                                this.selectedAreas[area] = true;
                            }
                        });
                    }
                    // 填充课程多选项
                    if (data.course && Array.isArray(data.course)) {
                        data.course.forEach(course => {
                            if (this.courses.includes(course)) { // 确保只处理存在的课程
                                this.selectedCourses[course] = true;
                            }
                        });
                    }
                }
                // 可能需要进一步处理数据，例如转换日期格式等
            } catch (error) {
                console.error("读取数据时发生错误:", error);
            }
        },

        resetMultiSelectModels() {
            this.areas.forEach(area => {
                this.selectedAreas[area] = false;
            });
            this.courses.forEach(course => {
                this.selectedCourses[course] = false;
            });
        },

        async saveTeacherData() {
            try {
                // 将选择的地区和课程从对象转换为数组
                const selectedAreasArray = Object.keys(this.selectedAreas).filter(key => this.selectedAreas[key]);
                const selectedCoursesArray = Object.keys(this.selectedCourses).filter(key => this.selectedCourses[key]);
                const { data, error } = await supabase
                    .from('teacher')
                    .upsert(
                        {
                            id: this.teacherForm.id, // 确保你的表格有一个'id'字段
                            name: this.teacherForm.name,
                            Alias: this.teacherForm.Alias,
                            birthday: this.teacherForm.birthday,
                            idcard: this.teacherForm.idcard,
                            mail: this.teacherForm.mail,
                            area: selectedAreasArray,
                            course: selectedCoursesArray,
                            phone: this.teacherForm.phone,
                            LineID: this.teacherForm.LineID,
                            registration_add: this.teacherForm.registration_add,
                            live_add: this.teacherForm.live_add,
                            bank_code: this.teacherForm.bank_code,
                            bank_account: this.teacherForm.bank_account,
                            bank_name: this.teacherForm.bank_name,
                            team: this.teacherForm.team,
                            created_at: new Date().toISOString()
                            // 根据你的需求添加其他字段
                        },
                    );
                if (error) throw error;
                let { data: userData, error: userError } = await supabase.from('teacher').select().eq('mail', this.$store.state.user.mail);
                console.log(this.$store.state.user.mail)
                // 将获取的用户数据存储到 Vuex state
                const user = userData[0];
                this.$store.commit('setUser', user);  // 假设我们关心的是第一条数据
                alert('教师数据保存成功！');
                await this.$store.dispatch('fetchDataFromItems', ['teacher']);
            } catch (error) {
                console.error('保存教师数据出错:', error);
                alert('保存教师数据出错');
            }
        },

        async handleFileUpload(uploadField, teacherId) {
            alert('卡關中 暫時跳過');
                return;
            if (!teacherId) {
                alert('请先将文字资料编辑保存后再进行上传照片');
                return;
            }
            // 假设 uploadField 是 'bank_ph'，那么 inputID 可能是 'teacher13'，你需要建立一个映射来获取正确的 ID
            const idMap = {
                'bank_ph': 'teacher13',
                'idc_ph': 'teacher14',
                'idc_ph1': 'teacher15',
                'sales_ph': 'teacher16'
            };
            let fileInput = document.getElementById(idMap[uploadField]);
            let file = fileInput.files[0];
            if (!file) return; // 如果没有文件则直接返回
            if (file.size > 1048576) { // 检查文件大小是否超过1MB
                alert('请将照片压缩后再上传，請勿超過1MB');
                return;
            }
            let filePath = `${teacherId}/${uploadField}.jpg`; // 确保文件路径与实际需求相匹配
            try {
                let { error } = await supabase.storage.from('teachers').upload(filePath, file);
                if (error) throw error;

                // 获取上传文件的URL
                let { publicURL, error: urlError } = supabase.storage.from('teachers').getPublicUrl(filePath);
                if (urlError) throw urlError;

                // 更新teacherForm中相应字段的值
                this.teacherForm[uploadField] = publicURL; // 直接赋值更新
                console.log(publicURL)

            } catch (err) {
                console.error('上传错误:', err.message);
            }
        }


    },
    computed: {
    }

}
</script>
<style scoped>
/* 在这里添加你的 CSS 样式 */
</style>
