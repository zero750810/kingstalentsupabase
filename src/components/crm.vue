<template>
    <div>
        <!-- Floating Action Button -->
        <button class="btn btn-primary rounded-circle float-button" data-bs-toggle="modal"
            data-bs-target="#customer-edit" @click="openAddModal">
            <i class="bi bi-plus-lg large-icon"></i> <!-- 使用 Bootstrap Icons -->
        </button>

        <!-- Filter buttons and search bar -->
        <div class="container-fluid mb-3">
            <div class="row justify-content-end">
                <div class="col-auto" v-for="area in ['all', '北區', '桃竹', '中區', '南區']" :key="area">
                    <button class="btn" :class="getButtonVariant(area)" @click="filterArea(area)">{{ area }}</button>
                </div>
                <div class="col-3">
                    <input type="search" class="form-control" v-model="searchQuery" placeholder="搜索客户名称">
                </div>
            </div>
        </div>
        <!-- Kanban columns -->
        <div class="container-fluid">
            <div class="row">
                <!-- Loop through kanban columns -->
                <div v-for="(status, index) in statuses" :key="index" class="col mb-3" :data-status-key="status.key">
                    <div class="card kanban-column">
                        <h4 class="card-header mb-0">{{ status.name }}</h4>
                        <div class="card-body" style="max-height: 83vh; overflow-y: auto;">
                            <!-- Use draggable component here -->
                            <draggable :list="filteredcrm(status.key)" group="crm" @end="updatecrmStatus" item-key="id">
                                <template #item="{ element }">
                                    <div v-if="element" :data-id="element.id" class="kanban-item">
                                        <div class="card mb-4" :class="['border-start', getBorderColor(element.area)]"
                                            @click="showDetails(element)" style="border-left-width: 0.5rem;"
                                            data-bs-toggle="modal" data-bs-target="#customer-details">
                                            <div>
                                                <h6 class="mb-1">{{ element.name }}</h6>
                                                <small class="text-muted">{{ element.lv }}</small>
                                            </div>
                                            <p class="card-text">{{ element.description }}</p>
                                        </div>
                                    </div>
                                </template>
                            </draggable>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 客户详情Modal -->
        <div class="modal fade" id="customer-details" tabindex="-1" aria-labelledby="customerDetailsLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="customerDetailsLabel">客户详情</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>客户名称：</strong>{{ selectedCustomer.name }}</p>
                        <p><strong>客户地址：</strong>{{ selectedCustomer.add }}</p>
                        <p><strong>负责地区：</strong>{{ selectedCustomer.area }}</p>
                        <p><strong>当前进度：</strong>{{ selectedCustomer.schedule }}</p>
                        <p><strong>客户等级：</strong>{{ selectedCustomer.lv }}</p>
                        <p><strong>客户窗口：</strong>{{ selectedCustomer.client_name }}</p>
                        <p><strong>客户电话：</strong>{{ selectedCustomer.client_phone }}</p>
                        <p><strong>客户邮箱：</strong>{{ selectedCustomer.client_mail }}</p>
                        <p><strong>负责业务：</strong>{{ this.teacherDisplayName() }}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                            data-bs-target="#customer-edit" @click="crmedit">编辑</button>
                        <button type="button" class="btn btn-secondary" data-bs-toggle="modal"
                            data-bs-target="#event-edit" @click="eventedit">课程规划</button>
                        <button type="button" class="btn btn-success" data-bs-toggle="modal"
                            data-bs-target="#quotation-edit" @click="eventedit">报价单制作</button>
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">联系记录</button>
                    </div>
                </div>
            </div>
        </div>

        <!--客户编辑Modal -->
        <div class="modal fade" id="customer-edit" tabindex="-1" aria-labelledby="customerEditLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="customerEditLabel">客户编辑</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="row mb-3" v-for="item in formItems" :key="item.key">
                                <!-- Label column -->
                                <div class="col-auto align-self-center">
                                    <label :for="item.key" class="form-label">{{ item.label }}</label>
                                </div>
                                <!-- Input/select column -->
                                <div class="col-sm-9 ">
                                    <input v-if="item.type === 'input'" type="text" :id="item.key" class="form-control"
                                        v-model="tempCustomer[item.key]" />
                                    <select v-else :id="item.key" class="form-select" v-model="tempCustomer[item.key]"
                                        :disabled="item.readonly">
                                        <option v-for="option in item.options" :value="option.value"
                                            :key="option.value">
                                            {{ option.text }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </form>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="saveCustomerDetails">保存</button>
                    </div>
                </div>
            </div>
        </div>

        <!--课程编辑Modal -->
        <div class="modal fade" id="event-edit" tabindex="-1" aria-labelledby="eventEditLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="eventEditLabel">课程编辑</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="row">
                                <!-- Left column for form fields -->
                                <div class="col-md-6">
                                    <form>
                                        <div class="row g-3 align-items-center" v-for="item in eventItems"
                                            :key="item.key">
                                            <div class="col-auto">
                                                <label :for="item.key" class="col-form-label">{{ item.label }}</label>
                                            </div>
                                            <div class="col">
                                                <input v-if="item.type === 'input'" :id="item.key" class="form-control"
                                                    v-model="tempCustomer[item.key]" :readonly="item.readonly">
                                                <select v-else-if="item.type === 'select'" :id="item.key"
                                                    class="form-select" v-model="tempCustomer[item.key]"
                                                    :disabled="item.readonly">
                                                    <option v-for="option in item.options" :value="option.value"
                                                        :key="option.value">{{ option.text }}</option>
                                                </select>
                                                <input v-else-if="item.type === 'date'" type="date" :id="item.key"
                                                    class="form-control" v-model="tempCustomer[item.key]"
                                                    :readonly="item.readonly">
                                                <input v-else-if="item.type === 'time'" type="time" :id="item.key"
                                                    class="form-control" v-model="tempCustomer[item.key]"
                                                    :readonly="item.readonly">
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <!-- Right column for event details -->
                                <div class="col-md-6 overflow-auto" style="max-height: 75vh;">
                                    <div v-for="(groupedEvents, category) in groupedByCategory" :key="category">
                                        <div class="d-flex justify-content-between mt-2">
                                            <button class="btn btn-info col-8" type="button" data-bs-toggle="collapse"
                                                :data-bs-target="'#collapse-' + category">
                                                {{ category }}
                                            </button>
                                            <button class="btn btn-warning col-4"
                                                @click="generatePdf(groupedEvents, category)">
                                                請款生成
                                            </button>
                                        </div>
                                        <div :id="'collapse-' + category" class="collapse mt-2">
                                            <div v-for="(events, talent) in groupedEvents" :key="talent">
                                                <button class="btn btn-secondary w-100" type="button"
                                                    data-bs-toggle="collapse"
                                                    :data-bs-target="'#collapse-' + category + '-' + talent">
                                                    {{ talent }}
                                                </button>
                                                <div :id="'collapse-' + category + '-' + talent" class="collapse mt-2">
                                                    <div v-for="event in events" :key="event.id">
                                                        <div class="card mb-3">
                                                            <div class="card-header" data-bs-toggle="collapse"
                                                                :data-bs-target="'#event-details-' + event.id">
                                                                {{ event.date }} - {{ event.course_titleid1 }}
                                                            </div>
                                                            <div :id="'event-details-' + event.id" class="collapse">
                                                                <div class="card-body">
                                                                    <p>课程时间: {{ event.start_time }} - {{ event.end_time
                                                                        }}
                                                                    </p>
                                                                    <p>授课老师: {{ event.teacherid1 }}</p>
                                                                    <p>钟点费用: {{ event.hourly_rate }}</p>
                                                                    <p>材料费用: {{ event.material_fee }}</p>
                                                                    <p>课程备注: {{ event.remark }}</p>
                                                                    <button class="btn btn-primary"
                                                                        @click="editEvent(event)">编辑</button>
                                                                    <button class="btn btn-danger"
                                                                        @click="deleteEvent(event)">删除</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="saveeventDetails">保存</button>
                    </div>
                </div>
            </div>
        </div>

        <!--课程報價Modal -->
        <div class="modal fade" id="quotation-edit" tabindex="-1" aria-labelledby="quotationEditLabel"
            aria-hidden="true" ref="quotationModal">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="quotationEditLabel">课程報價</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <form>
                                    <div class="row g-3 align-items-center" v-for="item in quotationItems"
                                        :key="item.key">
                                        <div class="col-auto">
                                            <label :for="item.key" class="col-form-label">{{ item.label }}</label>
                                        </div>
                                        <div class="col">
                                            <input v-if="item.type === 'input'" :id="item.key" class="form-control"
                                                v-model="tempCustomer[item.key]" :readonly="item.readonly">
                                            <select v-else-if="item.type === 'select'" :id="item.key"
                                                class="form-select" v-model="tempCustomer[item.key]"
                                                :disabled="item.readonly">
                                                <option v-for="option in item.options" :value="option.value"
                                                    :key="option.value">{{ option.text }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                                <!-- 将计算结果部分移动到这里 -->
                                <div class="col-12 mt-3">
                                    <p>预估钟点：NTD {{ tempCustomer.hourly_rate * tempCustomer.estimated_halls *
                tempCustomer.hour * tempCustomer.estimated_classes }}</p>
                                    <p>预估材料：NTD {{
                (tempCustomer.course_type === '單堂計費') ?
                    (tempCustomer.material_fee * tempCustomer.estimated_number
                        * tempCustomer.estimated_classes * tempCustomer.estimated_halls) :
                    (tempCustomer.course_type === '包套計費') ?
                        (tempCustomer.material_fee * tempCustomer.estimated_number
                            * tempCustomer.estimated_classes) : 0
            }}</p>
                                    <p>预计金额：NTD {{
                    (tempCustomer.hourly_rate * tempCustomer.estimated_halls * tempCustomer.hour *
                        tempCustomer.estimated_classes) +
                    ((tempCustomer.course_type === '單堂計費') ?
                        (tempCustomer.material_fee * tempCustomer.estimated_number *
                            tempCustomer.estimated_classes * tempCustomer.estimated_halls) :
                        (tempCustomer.course_type === '包套計費') ?
                            (tempCustomer.material_fee * tempCustomer.estimated_number *
                                tempCustomer.estimated_classes) : 0)
                }}</p>
                                </div>
                            </div>

                            <!-- 右边的部分 -->
                            <div class="col-md-6" style="overflow-y: auto; max-height: 75vh;">
                                <!-- 遍历不同的类别 -->
                                <div v-for="(groupedByquotation, category) in groupedByquotation" :key="category">
                                    <div class="d-flex justify-content-between mt-2">
                                        <button class="btn btn-info col-8" type="button" data-bs-toggle="collapse"
                                            :data-bs-target="'#collapse-' + category">
                                            {{ category }}
                                        </button>
                                        <button class="btn btn-warning col-4"
                                            @click="generatePdf1(groupedByquotation, category)">
                                            報價生成
                                        </button>
                                    </div>
                                    <div :id="'collapse-' + category" class="collapse mt-2">

                                        <!-- 遍历该类别下的才艺项目 -->
                                        <div v-for="(events, talent) in groupedByquotation" :key="talent"
                                            class="card mt-2">
                                            <div class="card-header" data-bs-toggle="collapse"
                                                :data-bs-target="'#collapse-' + category + '-' + talent">
                                                {{ talent }}
                                            </div>
                                            <div :id="'collapse-' + category + '-' + talent" class="collapse">
                                                <!-- 显示每个事件的详细信息 -->
                                                <div v-for="event in events" :key="event.id">
                                                    <div class="card-body">
                                                        <p>收费类型: {{ event.course_type }}</p>
                                                        <p>钟点费用: {{ event.hourly_rate }}</p>
                                                        <p>材料费用: {{ event.material_fee }}</p>
                                                        <p>预估人数: {{ event.estimated_number }}</p>
                                                        <p>预估堂数: {{ event.estimated_halls }}</p>
                                                        <p>单堂时数: {{ event.hour }}</p>
                                                        <p>预估班数: {{ event.estimated_classes }}</p>
                                                        <p>课程备注: {{ event.remark }}</p>
                                                        <p>预估钟点：NTD
                                                            {{ event.hourly_rate * event.estimated_halls * event.hour *
                event.estimated_classes }}</p>
                                                        <p>预估材料：NTD
                                                            {{ (event.course_type === '單堂計費') ?
                (event.material_fee * event.estimated_number *
                    event.estimated_classes * event.estimated_halls) :
                (event.course_type === '包套計費') ?
                    (event.material_fee * event.estimated_number *
                        event.estimated_classes) : 0
                                                            }}</p>
                                                        <p>预计金额：NTD {{
                (event.hourly_rate * event.estimated_halls * event.hour *
                    event.estimated_classes) +
                ((event.course_type === '單堂計費') ?
                                                            (event.material_fee * event.estimated_number *
                                                            event.estimated_classes * event.estimated_halls) :
                                                            (event.course_type === '包套計費') ?
                                                            (event.material_fee * event.estimated_number *
                                                            event.estimated_classes) : 0)
                                                            }}</p>
                                                        <button class="btn btn-primary"
                                                            @click="editEvent(event)">编辑</button>
                                                        <button class="btn btn-danger"
                                                            @click="deleteEvent(event)">删除</button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="savequotation">保存</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script>
import draggable from 'vuedraggable';
import { supabase } from '@/supabase';
import { Modal } from 'bootstrap';
import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from '@/vfs_fonts';
// 将自定义字体设置到 pdfMake 中
pdfMake.vfs = vfsFonts.pdfMake.vfs;
pdfMake.fonts = {
    NotoSans: {
        normal: 'NotoSans.ttf',
        bold: 'NotoSans.ttf',
        italics: 'NotoSans.ttf',
        bolditalics: 'NotoSans.ttf'
    }
};

export default {
    components: {
        draggable, // 将 draggable 组件注册到当前 Vue 组件
    },

    data() {
        return {
            statuses: [
                { name: '待追蹤', key: '待追蹤' },
                { name: '追蹤中', key: '追蹤中' },
                { name: '開課(未定時間)', key: '開課(未定時間)' },
                { name: '開課(時間敲定)', key: '開課(時間敲定)' },
                { name: '已結案', key: '已結案' },
                { name: '未開成', key: '未開成' },
            ],

            selectedCustomer: {},
            tempCustomer: {},
            searchQuery: '',
            filter: 'all',
            selectedCustomerName: '',
            events: this.$store.state.data.event,
        };
    },
    methods: {
        filterArea(area) {
            console.log("area", area)
            this.filter = area;
        },

        filteredcrm(statusKey) {
            // 转换对象为数组并进行过滤
            return this.crm.filter(customer => customer.schedule === statusKey);
        },

        getBorderColor(area) {
            switch (area) {
                case '北區':
                    return 'border-primary'; // 蓝色边框
                case '桃竹':
                    return 'border-danger'; // 红色边框
                case '中區':
                    return 'border-success'; // 绿色边框
                case '南區':
                    return 'border-secondary'; // 紫色边框
                default:
                    return 'border-light'; // 默认边框
            }
        },

        getButtonVariant(area) {
            switch (area) {
                case '北區':
                    return 'primary';
                case '桃竹':
                    return 'danger';
                case '中區':
                    return 'success';
                case '南區':
                    return 'secondary';
                default:
                    return 'outline-info'; // 其他情况
            }
        },

        crmedit() {
            this.tempCustomer = {};
            this.tempCustomer = { ...this.selectedCustomer }
        },

        eventedit() {
            this.tempCustomer = {};
            this.selectedCustomerName = "";
            this.tempCustomer = { ...this.selectedCustomer };
            console.log("this.tempCustomer", this.tempCustomer)
            if ('id' in this.tempCustomer) {
                this.tempCustomer.crmid1 = this.tempCustomer.name;
                this.tempCustomer.crmid = this.tempCustomer.id;
                delete this.tempCustomer.id;
            }
            this.selectedCustomerName = this.tempCustomer.crmid;
        },

        showDetails(customer) {
            this.selectedCustomer = customer;
        },

        openaddModal() {
            this.tempCustomer = {}; // 重置临时客户对象
        },
        //crm儲存
        async saveCustomerDetails() {
            const { data, error } = await supabase
                .from('crm') // 确保这是你的表名
                .upsert({ // upsert 方法用于更新或插入数据
                    id: this.tempCustomer.id || undefined, // Supabase 通过 null 来处理新建情况
                    add: this.tempCustomer.add || '',
                    area: this.tempCustomer.area || '',
                    name: this.tempCustomer.name || '',
                    lv: this.tempCustomer.lv || '',
                    client_mail: this.tempCustomer.client_mail || '',
                    sales: this.tempCustomer.sales || '',
                    schedule: this.tempCustomer.schedule || '',
                    client_name: this.tempCustomer.client_name || '',
                    client_phone: this.tempCustomer.client_phone || '',
                    delete: false,
                    created_at: new Date().toISOString()
                });
            if (error) {
                console.error('Error saving event details: ', error);
            } else {
                await this.$store.dispatch('fetchDataFromItems', ['crm']);
                this.toggleModal('customer-edit', 'hide');
                this.toggleModal('customer-details', 'show');

            }
        },

        //crm拖曳事件儲存
        async updatecrmStatus(event) {
            let crmArray = Object.values(this.$store.state.data.crm)
            // 从事件的 DOM 元素中获取客户 ID
            const movedCustomerId = event.item.__draggable_context.element.id;
            // 在数组中查找对应的客户对象
            const movedCustomer = crmArray.find(customer => customer.id === movedCustomerId);
            if (!movedCustomer) {
                console.error("未找到被移动的客户");
                return;
            }
            let newStatusKey = null;
            let targetElement = event.to;
            // 遍历父元素直到找到含有 'data-status-key' 属性的元素
            while (targetElement && !newStatusKey) {
                newStatusKey = targetElement.getAttribute('data-status-key');
                targetElement = targetElement.parentElement; // 移动到上一级父元素
            }
            if (!newStatusKey) {
                console.error("没有在目标元素上找到状态键");
                return;
            }
            movedCustomer.schedule = newStatusKey;
            // 更新客户信息到 Supabase
            const { data, error } = await supabase
                .from('crm') // 使用你的实际表名
                .update({ schedule: movedCustomer.schedule, created_at: new Date().toISOString() })
                .match({ id: movedCustomer.id });

            if (error) {
                console.error("更新客户状态失败: ", error);
            } else {
                console.log("客户状态更新成功");
            }
        },

        //model開關
        toggleModal(modalId, action) {
            const modalElement = document.getElementById(modalId);
            if (modalElement) {
                const modal = Modal.getOrCreateInstance(modalElement);
                if (action === 'show') {
                    modal.show();
                } else if (action === 'hide') {
                    modal.hide();
                }
            } else {
                console.error('No modal found with ID:', modalId);
            }
        },
        //課程儲存
        async saveeventDetails() {
            const { data, error } = await supabase
                .from('event') // 确保这是你的表名
                .upsert({ // upsert 方法用于更新或插入数据
                    id: this.tempCustomer.id || undefined, // Supabase 通过 null 来处理新建情况
                    type: this.tempCustomer.type || null,
                    remark: this.tempCustomer.remark || null,
                    course_titleid: this.tempCustomer.course_titleid || null,
                    teacherid: this.tempCustomer.teacherid || null,
                    hour: this.tempCustomer.hour || null,
                    end_time: this.tempCustomer.end_time || null,
                    start_time: this.tempCustomer.start_time || null,
                    date: this.tempCustomer.date || null,
                    estimated_number: this.tempCustomer.estimated_number || null,
                    material_fee: this.tempCustomer.material_fee || null,
                    hourly_rate: this.tempCustomer.hourly_rate || null,
                    course: this.tempCustomer.course || null,
                    course_time: this.tempCustomer.course_time || null,
                    area: this.tempCustomer.area || null,
                    crmid: this.tempCustomer.crmid || null,
                    delete: false,
                    created_at: new Date().toISOString()
                });

            if (error) {
                console.error('Error saving event details: ', error);
            } else {
                await this.$store.dispatch('fetchDataFromItems', ['event']);
                this.tempCustomer = {}; // 清空临时数据
                this.eventedit()
            }
        },

        //報價儲存
        async savequotation() {
            const { data, error } = await supabase
                .from('quotation') // 确保这是你的表名
                .upsert({ // upsert 方法用于更新或插入数据
                    id: this.tempCustomer.id || undefined, // Supabase 通过 null 来处理新建情况
                    course_time: this.tempCustomer.course_time || null,
                    crmid: this.tempCustomer.crmid || null,
                    area: this.tempCustomer.area || null,
                    course: this.tempCustomer.course || null,
                    course_type: this.tempCustomer.course_type || null,
                    material_fee: this.tempCustomer.material_fee || null,
                    hourly_rate: this.tempCustomer.hourly_rate || null,
                    estimated_number: this.tempCustomer.estimated_number || null,
                    estimated_halls: this.tempCustomer.estimated_halls || null,
                    hour: this.tempCustomer.hour || null,
                    estimated_classes: this.tempCustomer.estimated_classes || null,
                    remark: this.tempCustomer.remark || null,
                    delete: false,
                    created_at: new Date().toISOString()
                });

            if (error) {
                console.error('Error saving event details: ', error);
            } else {
                await this.$store.dispatch('fetchDataFromItems', ['quotation']);
                this.tempCustomer = {}; // 清空临时数据
                this.eventedit()
            }
        },

        editEvent(event) {
            this.tempCustomer = event;
        },
        //課程刪除
        async deleteEvent(event) {
            console.log(event)
            if (confirm('确定要删除这条记录吗？')) {
                try {
                    const { data, error } = await supabase
                        .from('event') // 确保这是你的表名
                        .upsert({ id: event.id, delete: true, created_at: new Date().toISOString() });
                    if (error) throw error;
                    // 数据更新后重新获取事件列表
                    await this.$store.dispatch('fetchDataFromItems', ['event']);
                } catch (error) {
                    console.error("Error removing document: ", error);
                }
            }
        },
        //報價刪除
        async deletequotation(event) {
            console.log(event)
            if (confirm('确定要删除这条记录吗？')) {
                try {
                    const { data, error } = await supabase
                        .from('quotation') // 确保这是你的表名
                        .upsert({ id: event.id, delete: true, created_at: new Date().toISOString() });
                    if (error) throw error;
                    // 数据更新后重新获取事件列表
                    await this.$store.dispatch('fetchDataFromItems', ['quotation']);
                } catch (error) {
                    console.error("Error removing document: ", error);
                }
            }
        },

        getOptions(fieldName) {
            const rawOptions = this.$store.state.data.set[0][fieldName];
            const mappedOptions = (rawOptions || []).map(option => {
                return { value: option, text: option }; // 假设option本身就是你想要的值和文本
            });
            return mappedOptions;
        },

        //老師轉換名稱
        teacherDisplayName() {
            // 从 Vuex 获取所有教师的数据
            const teachers = this.$store.state.data.teacher;
            const crmArray = Object.values(teachers);
            // 查找与 selectedCustomer.sales 匹配的教师
            const teacher = crmArray.find(teacher => teacher.id === this.selectedCustomer.sales);
            // 如果找到了对应的教师，则返回其綽號和本名；否则，返回原 ID 附加一个星号
            return teacher ? `${teacher.name} / ${teacher.Alias}` : `${this.selectedCustomer.sales}*`;
        },

        //課程轉換名稱
        filteredLessonPlansOptions() {
            const Talent = this.tempCustomer.course;
            if (!Talent) {
                return [];
            }
            // 过滤出符合选中才艺项目的课程计划
            let filteredLessonPlans = Object.values(this.$store.state.data.lesson_plans).filter(plan => plan.course === Talent);
            // 对过滤出来的课程计划根据名称进行排序
            filteredLessonPlans = filteredLessonPlans.sort((a, b) => a.name.localeCompare(b.name));
            // 将过滤并排序后的课程计划映射为下拉菜单选项
            return filteredLessonPlans.map(plan => {
                return { value: plan.id, text: plan.name };
            });
        },
        //請款單pdf製作
        generatePdf(groupedEvents) {
            // 定義一個空數組用於存儲 PDF 文檔的各個部分
            let today = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
            // 假设 `groupedEvents` 和 `this.crm` 已经准备好
            let firstCategory = Object.keys(groupedEvents)[0];  // 获取第一个分类名
            let firstEvent = groupedEvents[firstCategory][0];  // 获取该分类下的第一个事件
            let relatedCrm = this.crm.find(crmItem => crmItem.id === firstEvent.crmid);  // 根据 crmid 查找相关的 CRM 信息
            let sales = Object.values(this.$store.state.data.teacher);
            let salesdata = sales.find(crmItem => crmItem.id === relatedCrm.sales);
            console.log("salesdata", salesdata)

            let documentDefinition = {
                content: [
                    // 抬头
                    { text: '國 王 才 藝 課 程 請 款 單', style: 'header', alignment: 'center' },
                    // 表格1
                    {
                        style: 'tableExample',
                        table: {
                            widths: ['*', '*', '*', '*'],
                            body: [
                                // 留空的一行，如果不需要可以去掉
                                [{ text: '', colSpan: 4, style: 'tableCell' }, {}, {}, {}],
                                // 其他行
                                [{ text: '課程時間', style: 'tableCell' }, { text: `${firstEvent.course_time}` }, { text: '請款日期', style: 'tableCell' }, { text: `${today}` }],
                                [{ text: '單位名稱', style: 'tableCell' }, { text: `${relatedCrm.name}` }, { text: '單位窗口', style: 'tableCell' }, { text: `${relatedCrm.client_name}` }],
                                [{ text: '單位地址', style: 'tableCell' }, { text: `${relatedCrm.add}`, colSpan: 3 }, {}, {}], // 單位地址佔用三格
                                [{ text: '業務窗口', style: 'tableCell' }, { text: `${salesdata.name}` }, { text: '聯繫電話', style: 'tableCell' }, { text: `${salesdata.phone}` }]
                            ]
                        },
                        layout: 'lightHorizontalLines'
                    },
                    // 表格2
                    {
                        style: 'table2',
                        table: {
                            widths: ['*', '*', '*', '*', '*'],
                            body: [
                                [{ text: '項 目', style: 'tableCell' }, { text: '品 項', style: 'tableCell' }, { text: '單 價', style: 'tableCell' }, { text: '數 量', style: 'tableCell' }, { text: '金 額', style: 'tableCell' }],
                            ]
                        },
                        layout: 'lightHorizontalLines'
                    },
                    // 注释部分
                    {
                        style: 'notes',
                        ul: [
                            '以上報價包含各項必要支出和服務費用，服務內容請參考附件。',
                            '報價有效期至 {{today7}}。',
                            '若有任何問題，請隨時聯繫。',
                            '若無異議請於三日內回傳本申請表格，並於三日內完成付款以確認服務。',
                        ]
                    }
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15]
                    },
                    tableCell: {
                        alignment: 'center'
                    },
                },
                defaultStyle: {
                    font: 'NotoSans' // 使用 NotoSans 作为默认字体
                }
            };
            // 遍歷 groupedEvents 對象
            for (const category in groupedEvents) {
                if (groupedEvents.hasOwnProperty(category)) {
                    const events = groupedEvents[category];
                    // 添加分類標題到 PDF
                    documentDefinition.content.push({ text: category, style: 'header' });
                    // 為每個分類創建一個表格
                    let tableBody = [
                        // 這是表頭
                        [{ text: '課程日期', style: 'tableHeader' }, { text: '開始時間', style: 'tableHeader' }, { text: '結束時間', style: 'tableHeader' }, { text: '授課老師', style: 'tableHeader' }, { text: '鐘點費用', style: 'tableHeader' }, { text: '材料費用', style: 'tableHeader' }, { text: '備注', style: 'tableHeader' }]
                    ];
                    // 填充表格內容
                    events.forEach(event => {
                        tableBody.push([
                            { text: event.date, alignment: 'left' },
                            { text: event.start_time, alignment: 'left' },
                            { text: event.end_time, alignment: 'left' },
                            { text: event.teacherid1, alignment: 'left' },
                            { text: event.hourly_rate, alignment: 'left' },
                            { text: event.material_fee, alignment: 'left' },
                            { text: event.remark, alignment: 'left' }
                        ]);
                    });
                    // 將表格加入到 PDF 文檔定義中
                    documentDefinition.content.push({
                        layout: 'lightHorizontalLines', // optional
                        table: {
                            headerRows: 1,
                            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                            body: tableBody
                        },
                        style: 'tableExample'
                    });
                }
            }
            // 使用 pdfMake 創建 PDF
            pdfMake.createPdf(documentDefinition).open();
        },
        //報價單pdf製作
        generatePdf1(groupedEvents) {
            // 定義一個空數組用於存儲 PDF 文檔的各個部分
            let today = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
            let today1 = new Date();
            let newDate = new Date(today1.setDate(today1.getDate() + 7)).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
            // 假设 `groupedEvents` 和 `this.crm` 已经准备好
            let firstCategory = Object.keys(groupedEvents)[0];  // 获取第一个分类名
            let firstEvent = groupedEvents[firstCategory][0];  // 获取该分类下的第一个事件
            let relatedCrm = this.crm.find(crmItem => crmItem.id === firstEvent.crmid);  // 根据 crmid 查找相关的 CRM 信息
            let sales = Object.values(this.$store.state.data.teacher);
            let salesdata = sales.find(crmItem => crmItem.id === relatedCrm.sales);
            console.log("groupedEvents", groupedEvents)
            console.log("salesdata", salesdata)

            let documentDefinition = {
                content: [
                    // 抬头
                    { text: '國 王 才 藝 課 程 報 價 單', style: 'header', alignment: 'center' },
                    // 表格1
                    {
                        style: 'tableExample',
                        table: {
                            widths: ['*', '*', '*', '*'],
                            body: [
                                [{ text: '課程時間', style: 'tableCell' }, { text: `${firstEvent.course_time}`, style: 'lcell' }, { text: '報價日期', style: 'tableCell' }, { text: `${today}`, style: 'lcell' }],
                                [{ text: '單位名稱', style: 'tableCell' }, { text: `${relatedCrm.name}`, style: 'lcell' }, { text: '單位窗口', style: 'tableCell' }, { text: `${relatedCrm.client_name}`, style: 'lcell' }],
                                [{ text: '單位地址', style: 'tableCell' }, { text: `${relatedCrm.add}`, colSpan: 3, style: 'lcell' }, {}, {}], // 單位地址佔用三格
                                [{ text: '業務窗口', style: 'tableCell' }, { text: `${salesdata.name}`, style: 'lcell' }, { text: '聯繫電話', style: 'tableCell' }, { text: `${salesdata.phone}`, style: 'lcell' }]
                            ]
                        },
                    },
                    // 表格2
                    {
                        style: 'table2',
                        table: {
                            widths: ['*', '*', '*', '*'],
                            body: this.prepareTableBody(groupedEvents)
                        },
                    },
                    // 表格3
                    {
                        style: 'table3',
                        table: {
                            widths: ['*', '*'],
                            body: [
                                // 留空的一行，如果不需要可以去掉                                
                                // 其他行
                                [{ text: '地區業務負責人', style: 'tableCell' }, { text: '客戶確認訂購簽名欄', style: 'tableCell' }],
                                [{ text: '', style: 'tableCell1' }, { text: '請蓋公司章及負責人簽名後回傳', style: 'tableCell1' }],
                            ]
                        },
                    },
                    // 注释部分
                    {
                        style: 'notes',
                        ul: [
                            {
                                text: [
                                    '以上報價金額為',
                                    { text: '『未稅』', color: 'blue' },
                                    '價，表演或執行業務完畢後，請於課程結束後隔月10日前以現金、現金票或匯款支付',
                                    { text: ' 請於課程結束後隔月10日前以現金、現金票或匯款支付', color: 'red' },
                                    ' 013 國泰世華銀行  帳號：123-03-500650-2'
                                ]
                            },
                            {
                                text: [
                                    '本報價內容如有變動，依雙方協定為基準，此報價單有效期限至',
                                    { text: `${newDate}`, color: 'red' },  // 假设 addDays 是一个添加天数的函数
                                ]
                            },
                            {
                                text: [
                                    '活動執行前需',
                                    { text: '『報價單回傳』', color: 'blue' },
                                    '確認程序，所有教學老師之教學時間，皆以客戶回傳報價單之時間先後為依據。',
                                ]
                            },
                            {
                                text: [
                                    '請告知主要聯絡人與聯繫方式，此人須有',
                                    { text: '『關鍵性之活動決定權』', color: 'blue' },
                                    '，以促進教學活動之最佳執行與溝通安排。',
                                ]
                            }
                        ]
                    }
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    notes: {
                        fontSize: 10,
                    },
                    tableExample: {
                        margin: [0, 10, 0, 15]
                    },
                    tableCell: {
                        alignment: 'center'
                    },
                    endtableCell: {
                        alignment: 'right',
                        margin: [0, 0, 40, 0]
                    },
                    endtableCell1: {
                        alignment: 'right',
                        margin: [0, 0, 10, 0]
                    },
                    centertableCell: {
                        margin: [15, 0, 0, 0]
                    },
                    lcell: {
                        alignment: 'left',
                        margin: [10, 0, 0, 0]
                    },

                    tableCell1: {
                        fontSize: 10,
                        alignment: 'center',
                        margin: [0, 150, 0, 0],
                    },
                    table3: {
                        margin: [0, 15, 0, 15],
                    },
                },
                defaultStyle: {
                    font: 'NotoSans' // 使用 NotoSans 作为默认字体
                }
            };
            // 使用 pdfMake 創建 PDF
            pdfMake.createPdf(documentDefinition).open();
        },
        //報價單pdf計算
        prepareTableBody(groupedEvents) {
            let body = [
                // 表头
                [{ text: '項 目', style: 'tableCell' }, { text: '內 容', style: 'tableCell', colSpan: 2 }, {}, { text: '金 額', style: 'tableCell' }]
            ];
            let totalAmount = 0;  // 用于累计总费用
            // 动态添加行
            for (const [category, events] of Object.entries(groupedEvents)) {
                // 分别处理每个分类下的所有事件
                let totalHourlyRate = 0;  // 用于累计鐘點费的总计
                let totalMaterialFee = 0; // 用于累计材料费的总计

                events.forEach(event => {
                    // 这里假设每个分类下的事件的费用和时间等信息相同，只取第一个事件作为示例
                    const { hourly_rate, estimated_halls, hour, estimated_classes, material_fee, estimated_number, course_type, remark } = event;
                    totalHourlyRate += hourly_rate * estimated_halls * hour * estimated_classes;
                    totalMaterialFee += material_fee;  // 假设材料费是固定的，不随堂数或班数变化
                    // 分类名 + 钟点费
                    body.push([
                        { text: `${category}鐘點費`, style: 'tableCell' },
                        { text: `$${hourly_rate} /hr * ${estimated_halls}堂 * ${hour} hr * ${estimated_classes}班`, style: 'centertableCell', colSpan: 2 },
                        {},
                        { text: `$${hourly_rate * estimated_halls * hour * estimated_classes}`, style: 'endtableCell' }
                    ]);
                    // 根据收费类型计算材料费用行
                    let materialContent, materialTotal;
                    if (course_type === "包套計費") {
                        materialContent = `$${material_fee} /套 * ${estimated_number}人/班 * ${estimated_classes}班 (包套收費)`;
                        materialTotal = material_fee * estimated_number * estimated_classes;
                    } else {  // 假设只有 "包套计费" 和 "单堂计费" 两种情况
                        console.log()
                        materialContent = `$${material_fee} /個 * ${estimated_number}人/班 * ${estimated_halls}堂 * ${estimated_classes}班 (單堂收費)`;
                        materialTotal = material_fee * estimated_number * estimated_halls * estimated_classes;
                    }
                    body.push([
                        { text: `${category}材料費`, style: 'tableCell' },
                        { text: materialContent, style: 'centertableCell', colSpan: 2 },
                        {},
                        { text: `$${materialTotal}`, style: 'endtableCell' }
                    ]);

                    if (remark != null) {
                        body.push([
                            { text: `${category}備註`, style: 'tableCell' },
                            { text: `${remark}`, style: 'centertableCell', colSpan: 3 },
                            {},
                            {},
                        ]);
                    };

                    totalAmount += (hourly_rate * estimated_halls * hour * estimated_classes) + materialTotal;  // 将当前事件的费用累加到总金额
                });

            }
            // 所有分类处理完毕后，添加总金额的行
            body.push([
                { text: '', colSpan: 2 },
                {},
                { text: '總金額', style: 'tableCell' },
                { text: `$${totalAmount}`, style: 'endtableCell' } // 在这里显示总金额
            ]);

            return body;
        },


    },
    mounted() {
    },
    computed: {
        formItems() {
            return [
                { key: 'name', label: '客戶名稱', type: 'input' },
                { key: 'add', label: '客戶地址', type: 'input' },
                { key: 'area', label: '負責地區', type: 'select', options: this.areaOptions },
                { key: 'schedule', label: '當前進度', type: 'select', options: this.progressOptions },
                { key: 'lv', label: '客戶等級', type: 'select', options: this.lvOptions },
                { key: 'client_name', label: '客戶窗口', type: 'input' },
                { key: 'client_phone', label: '客戶電話', type: 'input' },
                { key: 'client_mail', label: '客戶郵箱', type: 'input' },
                { key: 'sales', label: '負責業務', type: 'select', options: this.filteredteacherOptions }
            ];
        },
        eventItems() {
            return [
                { key: 'course_time', label: '課程時間', type: 'select', options: this.categoryOptions },
                { key: 'crmid1', label: '客戶名稱', type: 'input', readonly: true },
                { key: 'area', label: '負責地區', type: 'input', readonly: true },
                { key: 'course', label: '才藝項目', type: 'select', options: this.talentOptions },
                { key: 'hourly_rate', label: '鐘點費用', type: 'input' },
                { key: 'material_fee', label: '材料費用', type: 'input' },
                { key: 'estimated_number', label: '預估人數', type: 'input' },
                { key: 'date', label: '課程日期', type: 'date' },
                { key: 'start_time', label: '開始時間', type: 'time' },
                { key: 'end_time', label: '結束時間', type: 'time' },
                { key: 'hour', label: '課程時數', type: 'input' },
                { key: 'teacherid', label: '授課老師', type: 'select', options: this.filteredteacherOptions },
                { key: 'course_titleid', label: '課程內容', type: 'select', options: this.filteredLessonPlansOptions() },
                { key: 'remark', label: '課程備註', type: 'input' },
                { key: 'type', label: '課程型態', type: 'select', options: [{ value: "常態", text: "常態" }, { value: "營隊", text: "營隊" }, { value: "社團", text: "社團" }] },
            ];
        },
        quotationItems() {
            return [
                { key: 'course_time', label: '課程時間', type: 'select', options: this.categoryOptions },
                { key: 'crmid1', label: '客戶名稱', type: 'input', readonly: true },
                { key: 'area', label: '負責地區', type: 'input', readonly: true },
                { key: 'course', label: '才藝項目', type: 'select', options: this.talentOptions },
                { key: 'course_type', label: '收費類型', type: 'select', options: [{ value: "單堂計費", text: "單堂計費" }, { value: "包套計費", text: "包套計費" }] },
                { key: 'hourly_rate', label: '鐘點費用', type: 'input' },
                { key: 'material_fee', label: '材料費用', type: 'input' },
                { key: 'estimated_number', label: '預估人數', type: 'input' },
                { key: 'estimated_halls', label: '預估堂數', type: 'input' },
                { key: 'hour', label: '單堂時數', type: 'input' },
                { key: 'estimated_classes', label: '預估班數', type: 'input' },
                { key: 'remark', label: '課程備註', type: 'input' },
            ];
        },
        areaOptions() { return this.getOptions('area'); },
        lvOptions() { return this.getOptions('lv'); },
        progressOptions() { return this.getOptions('schedule'); },
        talentOptions() {
            // 先从getOptions获取所有选项
            const allOptions = this.getOptions('course');
            // 然后过滤掉文本为'业务'的选项
            return allOptions.filter(option => option.text !== '業務');
        },
        categoryOptions() { return this.getOptions('course_time').slice().reverse(); },
        filteredteacherOptions() {
            const selectedArea = this.tempCustomer.area;
            if (!selectedArea) {
                return [];
            }
            const teachers = this.$store.state.data.teacher;
            const teacherArray = Object.values(teachers);
            const filteredTeachers = teacherArray.filter(teacher =>
                teacher.area.includes(selectedArea) && teacher.course.includes(this.tempCustomer.course)
            );
            // 将过滤出的教师映射为下拉菜单选项
            return filteredTeachers.map(teacher => {
                return { value: teacher.id, text: teacher.name + " / " + teacher.Alias };
            });
        },
        //課程規劃計算
        groupedByCategory() {
            const crm = Object.values(this.$store.state.data.crm).reduce((acc, item) => {
                acc[item.id] = item.name;
                return acc;
            }, {});
            const teachers = Object.values(this.$store.state.data.teacher).reduce((acc, teacher) => {
                acc[teacher.id] = teacher.name + " / " + teacher.Alias; // 注意 'Alias' 应该是小写，除非在数据确实是大写
                return acc;
            }, {});
            const lessonPlans = Object.values(this.$store.state.data.lesson_plans).reduce((acc, plan) => {
                acc[plan.id] = plan.name;
                return acc;
            }, {});
            const filteredEvents = Object.values(this.$store.state.data.event).filter(event => event.crmid === this.selectedCustomerName);

            // 初始化用于存储排序后类别数据的对象
            let sortedEvents = {};

            // 获取类别排序数组
            const categoryOrder = this.$store.state.data.set[0]['course_time'].slice().reverse();

            // 按类别和才艺项目组织事件数据
            let categorizedEvents = filteredEvents.reduce((acc, event) => {
                const category = event['course_time'];
                const talent = event['course'];
                // 匹配教师名称和课程计划名称
                const crmname = crm[event.crmid] ? crm[event.crmid] : `${event.crmid}*`;
                const teacherName = teachers[event.teacherid] ? teachers[event.teacherid] : `${event.teacherid}*`;
                const lessonPlanName = lessonPlans[event.course_titleid] ? lessonPlans[event.course_titleid] : `${event.course_titleid}*`;

                if (!acc[category]) {
                    acc[category] = {};
                }
                if (!acc[category][talent]) {
                    acc[category][talent] = [];
                }
                // 创建一个新的对象来存储额外的字段
                const newEvent = {
                    ...event,
                    crmid1: crmname,
                    teacherid1: teacherName,
                    course_titleid1: lessonPlanName
                };
                acc[category][talent].push(newEvent);
                return acc;
            }, {});

            // 按照指定的顺序重构分类数据
            categoryOrder.forEach(category => {
                if (categorizedEvents[category]) {
                    sortedEvents[category] = categorizedEvents[category];

                    // 对每个类别下的才艺项目进行排序和事件排序
                    Object.keys(sortedEvents[category]).forEach(talent => {
                        sortedEvents[category][talent] = sortedEvents[category][talent].sort((a, b) => new Date(a.課程日期) - new Date(b.課程日期));
                    });
                }
            });
            return sortedEvents;
        },

        //課程報價計算
        groupedByquotation() {
            const crm = Object.values(this.$store.state.data.crm || {}).reduce((acc, item) => {
                acc[item.id] = item.name;
                return acc;
            }, {});
            const filteredEvents = Object.values(this.$store.state.data.quotation).filter(event => event.crmid === this.selectedCustomerName);
            // 初始化用于存储排序后类别数据的对象
            let sortedEvents = {};

            // 获取类别排序数组
            const categoryOrder = (this.$store.state.data.set[0] && this.$store.state.data.set[0]['course_time']) ? this.$store.state.data.set[0]['course_time'].slice().reverse() : [];

            // 按类别和才艺项目组织事件数据
            let categorizedEvents = filteredEvents.reduce((acc, event) => {
                const category = event['course_time'];
                const talent = event['course'];

                // 匹配教师名称和课程计划名称
                const crmname = crm[event.crmid] ? crm[event.crmid] : `${event.crmid}*`;

                if (!acc[category]) {
                    acc[category] = {};
                }
                if (!acc[category][talent]) {
                    acc[category][talent] = [];
                }

                // 创建一个新的对象来存储额外的字段
                const newEvent = {
                    ...event,
                    crmid1: crmname,
                };

                acc[category][talent].push(newEvent);
                return acc;
            }, {});

            // 按照指定的顺序重构分类数据
            categoryOrder.forEach(category => {
                if (categorizedEvents[category]) {
                    sortedEvents[category] = categorizedEvents[category];
                }
            });
            return sortedEvents;
        },

        crm() {
            // 原始状态
            let crmArray = Object.values(this.$store.state.data.crm).map(item => {
                return { ...item, course: '業務' };
            });
            // 根据地区过滤
            if (this.filter !== 'all') {
                crmArray = crmArray.filter(status => status.area === this.filter);
            }
            // 根据搜索查询过滤
            if (this.searchQuery) {
                crmArray = crmArray.filter(status => status.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
            }
            return crmArray;
        },
    },
};
</script>
<style scoped>
.float-button {
    position: fixed;
    right: 20px;
    bottom: 70px;
    z-index: 999;
    width: 60px;
    /* 设置按钮的宽度和高度确保它是圆的 */
    height: 60px;
    border-radius: 50%;
    /* 使按钮边缘圆滑 */
    display: flex;
    /* 使用 Flexbox 来居中图标 */
    align-items: center;
    justify-content: center;
}

.large-icon {
    font-size: 2.5rem;
    /* 或者使用像素，例如 24px */

}
</style>
