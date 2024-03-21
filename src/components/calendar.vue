<template>
    <!-- 上方篩選區 -->
    <div class="col-12 row mb-2">
        <!-- 時段選擇下拉菜單 -->
        <div class="col-1">
            <select class="form-select" v-model="selectedTimeSlot">
                <option v-for="timeSlot in course_times" :key="timeSlot" :value="timeSlot">
                    {{ timeSlot }}
                </option>
            </select>
        </div>
        <!-- 地區選擇下拉菜單 -->
        <div class="col-1">
            <select class="form-select" v-model="currentArea">
                <option value="all">所有地區</option>
                <option v-for="area in areas" :key="area" :value="area">
                    {{ area }}
                </option>
            </select>
        </div>
        <!-- 師資選擇下拉菜單 -->
        <div class="col-2">
            <select class="form-select" v-model="selectedTeacher">
                <option value="all">無篩選</option>
                <option v-for="teacher in filteredTeachers" :key="teacher.id" :value="teacher.id">
                    {{ teacher.name }}
                </option>
            </select>
        </div>
        <!-- 缺少師資按鈕 -->
        <div class="col-1">
            <button :class="['btn', lackOfTeacher ? 'btn-danger' : 'btn-warning']" @click="toggleLackOfTeacher">
                缺少師資
            </button>
        </div>
        <!-- 缺少課程按鈕 -->
        <div class="col-1">
            <button :class="['btn', lackOfCourse ? 'btn-danger' : 'btn-warning']" @click="toggleLackOfCourse">
                缺少課程
            </button>
        </div>
    </div>
    <!-- 行事曆本體 -->
    <div class="calendar-container">
        <FullCalendar :options="calendarOptions" />
    </div>
    <!-- 事件詳情 -->
    <div class="modal fade" id="eventModal" tabindex="-1" aria-labelledby="eventModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="eventModalLabel">事件詳情</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- 事件詳細信息展示 -->
                    <p>{{ tempEvent.course_time }} {{ tempEvent.area }}</p>
                    <p>客戶名稱：{{ tempEvent.crmName }}</p>
                    <p>才藝項目：{{ tempEvent.course }}</p>
                    <p>課程時間：{{ tempEvent.date }} {{ tempEvent.start_time }}~{{ tempEvent.end_time }} {{ tempEvent.hour
                        }}hr</p>
                    <p>鐘點費用：{{ tempEvent.hourly_rate }}</p>
                    <p>材料費用：{{ tempEvent.material_fee }}</p>
                    <p>預估人數：{{ tempEvent.estimated_number }}</p>
                    <p>授課老師：{{ tempEvent.teacherName }}</p>
                    <p>課程內容：{{ tempEvent.coursename }}</p>
                    <p>課程備註：{{ tempEvent.remark }}</p>
                    <p>上課人數：{{ tempEvent.people_number }}</p>
                    <!-- 更多信息... -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" @click="deleteEvent">刪除</button>
                    <button type="button" class="btn btn-primary" @click="editEvent">編輯</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                </div>
            </div>
        </div>
    </div>
    <!-- 事件編輯 -->
    <div class="modal fade" id="event-edit" tabindex="-1" aria-labelledby="eventEditLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="eventEditLabel">課程編輯</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <form>
                            <div class="row g-3 align-items-center" v-for="item in eventItems" :key="item.key">
                                <div class="col-auto">
                                    <label :for="item.key" class="col-form-label">{{ item.label }}</label>
                                </div>
                                <div class="col">
                                    <input v-if="item.type === 'input'" :id="item.key" class="form-control"
                                        v-model="tempEvent[item.key]" :readonly="item.readonly">
                                    <select v-else-if="item.type === 'select'" :id="item.key" class="form-select"
                                        v-model="tempEvent[item.key]" :disabled="item.readonly">
                                        <option v-for="option in item.options" :value="option.value"
                                            :key="option.value">{{ option.text }}</option>
                                    </select>
                                    <input v-else-if="item.type === 'date'" type="date" :id="item.key"
                                        class="form-control" v-model="tempEvent[item.key]" :readonly="item.readonly">
                                    <input v-else-if="item.type === 'time'" type="time" :id="item.key"
                                        class="form-control" v-model="tempEvent[item.key]" :readonly="item.readonly">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click="saveeventDetails">保存</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid'; // 用於日視圖
import interactionPlugin from '@fullcalendar/interaction';
import { Modal } from 'bootstrap';
import { supabase } from '@/supabase';
const tempEvent = ref({}); // 用於編輯時臨時存儲表單數據
const eventModal = ref(null); // 用於控制事件查看模態框的引用
const eventEditModal = ref(null); // 用於控制事件編輯模態框的引用
const store = useStore();
const lackOfTeacher = ref(false); // 控制缺少師資按鈕狀態
const lackOfCourse = ref(false); // 控制缺少課程按鈕狀態
// 時間段
const course_times = ref([...store.state.data.set[0].course_time].reverse());
const selectedTimeSlot = ref(course_times.value[0]); // 默認選擇第一個時間段

const areas = computed(() => store.state.data.set[0].area);
const currentArea = ref('all');

// 教師
const filteredTeachers = computed(() => {
    // 直接從 store 獲取教師數據，並將其從對象轉換為數組
    const teachers = Object.values(store.state.data.teacher);
    // 根據當前選中的地區過濾教師列表
    return currentArea.value === 'all'
        ? teachers
        : teachers.filter(teacher => teacher.area && teacher.area.includes(currentArea.value));
});
// 當區域改變時，重置選中的師資為 'all'
watch(currentArea, () => {
    selectedTeacher.value = 'all';
});
const selectedTeacher = ref('all');

const toggleLackOfTeacher = () => {
    lackOfTeacher.value = !lackOfTeacher.value;
};

const toggleLackOfCourse = () => {
    lackOfCourse.value = !lackOfCourse.value;
};


const eventData = computed(() => {
    const eventsArray = Object.values(store.state.data.event);
    return eventsArray
        .filter(event => {
            // 時間段篩選
            const isTimeSlotMatch = selectedTimeSlot.value === 'all' || event.course_time === selectedTimeSlot.value;
            // 地區篩選
            const isAreaMatch = currentArea.value === 'all' || event.area === currentArea.value;
            // 教師篩選
            const isTeacherMatch = selectedTeacher.value === 'all' || event.teacherid === selectedTeacher.value;
            // 缺少師資篩選
            const isLackOfTeacherMatch = !lackOfTeacher.value || (lackOfTeacher.value && !event.teacherid);
            // 缺少課程篩選
            const isLackOfCourseMatch = !lackOfCourse.value || (lackOfCourse.value && !event.course_titleid);
            // 綜合判斷所有篩選條件
            if (lackOfTeacher.value) {
                return isTimeSlotMatch && isAreaMatch && isLackOfTeacherMatch && isLackOfCourseMatch;
            } else {
                return isTimeSlotMatch && isAreaMatch && isTeacherMatch && isLackOfCourseMatch;
            }
        })
        .map(event => {
            // 安全地獲取 CRM 名稱
            const crmName = store.state.data.crm?.[event.crmid]?.name || '未知';
            const teacherName = store.state.data.teacher?.[event.teacherid]?.name || '未知';
            const courseName = store.state.data.lesson_plans?.[event.course_titleid]?.name || '未知';
            // 安全地獲取課程名稱
            const course = event.course || '未知';
            // 合併日期和時間，同時檢查是否存在無效的日期或時間
            const startDateTime = event.date && event.start_time
                ? `${event.date}T${event.start_time}`
                : null;  // 使用 null 或其他邏輯表示無效日期時間

            // 返回 FullCalendar 所需要的事件格式
            return {
                title: `${crmName} / ${course}`,
                start: startDateTime,
                allDay: !event.start_time, // 如果沒有指定時間，則視為全天事件
                extendedProps: {
                    id: event.id,
                    courseTime: event.course_time,
                    area: event.area,
                    customerName: crmName,
                    courseItem: courseName,
                    course: event.course,
                    Time: `${event.date} ${event.start_time}~${event.end_time} ${event.hour} hr`,
                    hourlyRate: event.hourly_rate,
                    materialFee: event.material_fee,
                    estimatedNumber: event.estimated_number,
                    remarks: event.remark,
                    teacherName: teacherName,
                    actualNumber: event.people_number
                }
            };
        }); // 過濾掉無效的事件
});

// 初始化模態框實例
onMounted(() => {
    eventModal.value = new Modal(document.getElementById('eventModal'), {
        keyboard: false
    });
    eventEditModal.value = new Modal(document.getElementById('event-edit'), {
        keyboard: false
    });
});


//刪除事件
const deleteEvent = async () => {
    if (confirm('確定要刪除這個事件嗎？')) {
        const eventId = tempEvent.value.id;
        const { error } = await supabase
            .from('events')
            .update({ delete: true, created_at: new Date().toISOString() })
            .match({ id: eventId });
        if (error) {
            alert('無法刪除事件，請重試。');
        } else {
            alert('事件已成功刪除。');
            await store.dispatch('fetchDataFromItems', ['events']);
            tempEvent.value = null; // 清空或更新事件詳情
        }
    }
};

const saveeventDetails = async () => {
    if (!tempEvent.value || !tempEvent.value.id) {
        alert('無有效事件進行保存');
        return;
    }
    try {
        // 更新數據庫中的事件條目
        const { data, error } = await supabase
            .from('event')  // 確保表名正確
            .update({
                hourly_rate: tempEvent.value.hourly_rate,
                material_fee: tempEvent.value.material_fee,
                estimated_number: tempEvent.value.estimated_number,
                date: tempEvent.value.date,
                start_time: tempEvent.value.start_time,
                end_time: tempEvent.value.end_time,
                hour: tempEvent.value.hour,
                teacherid: tempEvent.value.teacherid,
                course_titleid: tempEvent.value.course_titleid,
                remark: tempEvent.value.remark,
                created_at: new Date().toISOString()
            })
            .match({ id: tempEvent.value.id });  // 確保根據正確的id更新
        if (error) {
            throw error;
        }
        // 如果更新成功，關閉模態框並清空tempEvent
        eventEditModal.value.hide();
        // 更新本地緩存的事件列表
        await store.dispatch('fetchDataFromItems', ['event']);
    } catch (error) {
        console.error('保存事件詳情出錯:', error);
        alert('保存事件詳情出錯');
    }
};


// 編輯事件的邏輯
const editEvent = () => {
    // 打開編輯事件的模態框
    eventEditModal.value.show();
};

// 事件詳情model
const handleEventClick = (info) => {
    const eventId = info.event.extendedProps.id;  // 從點擊的事件中獲取ID
    const event = store.state.data.event[eventId];  // 從store中獲取事件詳情

    if (event) {
        // 更新tempEvent的信息
        tempEvent.value = {
            ...event,
            crmName: store.state.data.crm[event.crmid]?.name || '未知客戶',
            teacherName: store.state.data.teacher[event.teacherid]?.name || '未設定老師',
            coursename: store.state.data.lesson_plans[event.course_titleid]?.name || '未設定課程'
        };
        eventModal.value.show();  // 顯示模態框
    } else {
        alert('事件詳情未找到！');
    }
};


const eventItems = computed(() => {
    return [
        { key: 'course_time', label: '課程時間', type: 'input', readonly: true },
        { key: 'crmName', label: '客戶名稱', type: 'input', readonly: true },
        { key: 'area', label: '負責地區', type: 'input', readonly: true },
        { key: 'course', label: '才藝項目', type: 'input', readonly: true },
        { key: 'hourly_rate', label: '鐘點費用', type: 'input' },
        { key: 'material_fee', label: '材料費用', type: 'input' },
        { key: 'estimated_number', label: '預估人數', type: 'input' },
        { key: 'date', label: '課程日期', type: 'date' },
        { key: 'start_time', label: '開始時間', type: 'time' },
        { key: 'end_time', label: '結束時間', type: 'time' },
        { key: 'hour', label: '課程時數', type: 'input' },
        { key: 'teacherid', label: '授課老師', type: 'select', options: filteredTeacherOptions.value },
        { key: 'course_titleid', label: '課程內容', type: 'select', options: filteredLessonPlansOptions.value },
        { key: 'remark', label: '課程備注', type: 'input' },
        { key: 'people_number', label: '上課人數', type: 'input' },
    ];
});

//老師下拉選單轉換名稱
const filteredTeacherOptions = computed(() => {
    const selectedArea = tempEvent.value.area;  // 確保 tempEvent 也是一個響應式引用
    if (!selectedArea) {
        return [];
    }
    const teacherArray = Object.values(store.state.data.teacher);
    const filteredTeachers = teacherArray.filter(teacher =>
        (Array.isArray(teacher.area) && teacher.area.includes(selectedArea)) &&
        (Array.isArray(teacher.course) && teacher.course.includes(tempEvent.value.course))
    );
    return filteredTeachers.map(teacher => {
        return { value: teacher.id, text: teacher.name + (teacher.Alias ? " / " + teacher.Alias : '') };
    });
});

//課程下拉選單轉換名稱
const filteredLessonPlansOptions = computed(() => {
    const Talent = tempEvent.value.course;  // 確保 tempEvent 是一個響應式引用
    if (!Talent) {
        return [];
    }
    let filteredLessonPlans = Object.values(store.state.data.lesson_plans).filter(plan => plan.course === Talent);
    filteredLessonPlans.sort((a, b) => a.name.localeCompare(b.name));  // 注意：sort 會改變原數組
    return filteredLessonPlans.map(plan => {
        return { value: plan.id, text: plan.name };
    });
});

const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek'
    },
    editable: true,
    droppable: true,
    height: '92vh',

    views: {
        dayGridMonth: {
            buttonText: '行事曆',
            dayMaxEvents: 3, // 設置每日最多顯示的事件數量
            eventTimeFormat: {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            },
            titleFormat: {
                year: 'numeric',
                month: 'numeric',
            },
        },
        dayGridWeek: {
            buttonText: '週清單',
            eventTimeFormat: {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            },
            titleFormat: {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            },
            titleRangeSeparator: ' to ',
        }
    },
    events: eventData, // 你的事件數組
    eventClick: handleEventClick,
    eventDrop: async function (info) {
        // 獲取拖放後的新日期
        const newDate = info.event.start.toISOString().split('T')[0]; // 格式化為 YYYY-MM-DD

        // 獲取事件的其他信息，如 id
        const eventId = info.event.extendedProps.id;
        // 更新事件的日期字段
        const { data, error } = await supabase
            .from('event') // 替換為你的數據表名稱
            .update({ date: newDate, created_at: new Date().toISOString() }) // 更新日期字段
            .match({ id: eventId }); // 根據事件 ID 來匹配記錄

        if (error) {
            // 處理更新失敗的情況
            console.error('更新事件日期失敗:', error);
            alert('無法更新事件日期，請重試。');
        } else {
            await store.dispatch('fetchDataFromItems', ['event']);
        }
    },

    //eventResize: function (info) {
    // 事件調整大小邏輯
    // },
    eventDidMount: function (info) {
        // 點點顏色設置
    },
    // 添加更多 FullCalendar 的配置...
});

</script>

<style></style>
