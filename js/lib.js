/*
 * ВГУ Расписание | Version [build_version]
 * Build: [build_info]
 * Developer: @whoennrl
 * 
 * Site: https://whoennrl.ru  
 */

(function () {
    'use strict';

    window.ScheduleAPI = {

        baseUrl: '',
        initData: null,

        init: function (baseUrl) {
            this.baseUrl = baseUrl;
            if (typeof Telegram !== 'undefined' && Telegram.WebApp && Telegram.WebApp.initData) {
                this.initData = decodeURI(Telegram.WebApp.initData);
            }
            return this;
        },

        setInitData: function (initData) {
            this.initData = initData;
            return this;
        },

        request: function (type, params) {
            if (type !== 'update') {
                if (!this.initData) {
                    return Promise.reject(new Error('Не установлены данные авторизации. Вызовите ScheduleAPI.setInitData() или убедитесь, что библиотека работает внутри Telegram WebApp.'));
                }
                params.init_data = this.initData;

                return fetch(this.baseUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(Object.assign({ type: type }, params))
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(data => {
                            throw new Error(data.error || 'Ошибка сервера');
                        });
                    }
                    return response.json();
                });
            } else {
                const urlParams = new URLSearchParams(Object.assign({ type: type }, params));
                return fetch(`${this.baseUrl}?${urlParams.toString()}`, { method: 'GET' })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(data => {
                                throw new Error(data.error || 'Ошибка сервера');
                            });
                        }
                        return response.json();
                    });
            }
        },

        // ======================
        // ЭНДПОИНТЫ СТАТИСТИКИ
        // ======================
        getPlatformStats: function () {
            return this.request('get_platform_stats', {});
        },

        getVersionStats: function (platform) {
            return this.request('get_version_stats', platform ? { platform: platform } : {});
        },

        getAllUsers: function () {
            return this.request('get_all_users', {});
        },

        getHourlyStats: function () {
            return this.request('get_hourly_stats', {});
        },

        getDailyStats: function () {
            return this.request('get_daily_stats', {});
        },

        getUserStats: function () {
            return this.request('get_user_stats', {});
        },

        // ======================
        // ЭНДПОИНТ АНАЛИТИКИ
        // ======================
        analytics: function (platform, telegramVersion) {
            const params = {
                platform: platform || (typeof Telegram !== 'undefined' ? Telegram.WebApp.platform : 'web'),
                telegram_version: telegramVersion || (typeof Telegram !== 'undefined' ? Telegram.WebApp.version : 'unknown')
            };
            return this.request('analytics', params);
        },

        // ======================
        // ЭНДПОИНТЫ ДЛЯ БАНОВ
        // ======================
        getBanStatus: function (userId) {
            return this.request('get_ban_status', { user_id: userId });
        },

        banUser: function (userId, reason) {
            return this.request('ban_user', {
                user_id: userId,
                reason: reason || 'Нарушение правил'
            });
        },

        unbanUser: function (userId) {
            return this.request('unban_user', { user_id: userId });
        },

        getBannedUsers: function () {
            return this.request('get_banned_users', {});
        },

        checkAdmin: function () {
            return this.request('check_admin', {});
        },

        // ======================
        // ОСНОВНЫЕ ЭНДПОИНТЫ
        // ======================
        getFaculties: function () {
            return this.request('get_faculties', {});
        },

        getGroups: function (faculty) {
            if (!faculty) {
                return Promise.reject(new Error('Параметр "faculty" обязателен'));
            }
            return this.request('get_groups', { faculty: faculty });
        },

        getWeek: function (faculty, group) {
            if (!faculty || !group) {
                return Promise.reject(new Error('Параметры "faculty" и "group" обязательны'));
            }
            return this.request('get_week', { faculty: faculty, group: group });
        },

        getDay: function (faculty, group, day) {
            if (!faculty || !group || !day) {
                return Promise.reject(new Error('Параметры "faculty", "group" и "day" обязательны'));
            }
            return this.request('get_day', { faculty: faculty, group: group, day: day });
        },

        getDate: function (faculty, group, date) {
            if (!faculty || !group || !date) {
                return Promise.reject(new Error('Параметры "faculty", "group" и "date" обязательны'));
            }
            return this.request('get_date', { faculty: faculty, group: group, date: date });
        },

        getCurrentLesson: function (faculty, group) {
            if (!faculty || !group) {
                return Promise.reject(new Error('Параметры "faculty" и "group" обязательны'));
            }
            return this.request('get_current_lesson', { faculty: faculty, group: group });
        },

        getTeachers: function () {
            return this.request('get_teachers', {});
        },

        getTeacherSchedule: function (teacher, weekOffset) {
            if (!teacher) {
                return Promise.reject(new Error('Параметр "teacher" обязателен'));
            }
            const params = { teacher: teacher };
            if (weekOffset !== undefined) {
                params.week_offset = weekOffset;
            }
            return this.request('get_teacher_schedule', params);
        },

        getTeachersPhotos: function () {
            return this.request('get_teachers_photos', {});
        },

        getTeacherPhoto: function (teacher) {
            if (!teacher) {
                return Promise.reject(new Error('Параметр "teacher" обязателен'));
            }
            return this.request('get_teacher_photo', { teacher: teacher });
        },

        getStats: function () {
            return this.request('get_stats', {});
        },

        getStatistics: function () {
            return this.request('get_statistics', {});
        },

        updateSchedule: function () {
            return this.request('update', {});
        },

        getHistory: function (faculty, group, date) {
            if (!faculty || !group || !date) {
                return Promise.reject(new Error('Параметры "faculty", "group" и "date" обязательны'));
            }
            return this.request('get_history', { faculty: faculty, group: group, date: date });
        },

        // ======================
        // 🆕 ЭНДПОИНТЫ ДЛЯ АУДИТОРИЙ (с нормализацией)
        // ======================
        
        /**
         * Получить список аудиторий с группировкой дублей
         * @param {boolean} withVariants - возвращать ли все варианты названий
         * @returns {Promise} Список аудиторий
         */
        getClassrooms: function (withVariants = false) {
            return this.request('get_classrooms', { with_variants: withVariants });
        },

        /**
         * Получить расписание аудитории на неделю (автоматическая нормализация названия)
         * @param {string} classroom - Номер аудитории (в любом формате)
         * @returns {Promise} Расписание + информация о нормализации
         */
        getClassroomWeek: function (classroom) {
            if (!classroom) {
                return Promise.reject(new Error('Параметр "classroom" обязателен'));
            }
            return this.request('get_classroom_week', { classroom: classroom });
        },

        /**
         * Получить расписание аудитории на дату (с нормализацией)
         * @param {string} classroom - Номер аудитории
         * @param {string} date - Дата в формате "ДД.ММ.ГГГГ"
         * @returns {Promise} Расписание + каноническое название
         */
        getClassroomDate: function (classroom, date) {
            if (!classroom || !date) {
                return Promise.reject(new Error('Параметры "classroom" и "date" обязательны'));
            }
            return this.request('get_classroom_date', { 
                classroom: classroom, 
                date: date 
            });
        },

        /**
         * Получить статус аудиторий на текущий момент (с нормализованными названиями)
         * @returns {Promise} Объект со свободными/занятыми аудиториями
         */
        getClassroomStatus: function () {
            return this.request('get_classroom_status', {});
        },

        /**
         * Получить статистику занятости аудиторий
         * @returns {Promise} Статистика по каждой аудитории
         */
        getClassroomStats: function () {
            return this.request('get_classroom_stats', {});
        },

        // ======================
        // 🆕 ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
        // ======================

        /**
         * Найти каноническое название аудитории по любому варианту
         * @param {string} classroom - Любое название аудитории
         * @returns {Promise<string>} Каноническое название
         */
        getCanonicalClassroom: async function (classroom) {
            const data = await this.getClassroomWeek(classroom);
            return data.classroom_canonical || classroom;
        },

        /**
         * Проверить занятость аудитории (работает с любым форматом названия)
         * @param {string} classroom - Название аудитории
         * @returns {Promise<boolean>}
         */
        isClassroomOccupied: async function (classroom) {
            const status = await this.getClassroomStatus();
            const canonical = await this.getCanonicalClassroom(classroom);
            return status.occupied && status.occupied.hasOwnProperty(canonical);
        },

        /**
         * Получить список свободных аудиторий прямо сейчас
         * @returns {Promise<Array<string>>} Массив номеров свободных аудиторий
         */
        getFreeClassroomsNow: async function () {
            const status = await this.getClassroomStatus();
            return status.free || [];
        },

        /**
         * Получить список занятых аудиторий с информацией о парах
         * @returns {Promise<Object>} Объект с информацией о занятых аудиториях
         */
        getOccupiedClassroomsNow: async function () {
            const status = await this.getClassroomStatus();
            return status.occupied || {};
        },

        /**
         * Найти свободные аудитории на дату и номер пары
         * @param {string} date - Дата "ДД.ММ.ГГГГ"
         * @param {number} lessonNumber - Номер пары
         * @returns {Promise<Array<string>>} Список канонических названий свободных аудиторий
         */
        findFreeClassrooms: async function (date, lessonNumber) {
            if (!date || !lessonNumber) {
                return Promise.reject(new Error('Параметры "date" и "lessonNumber" обязательны'));
            }
            
            const classrooms = await this.getClassrooms();
            const freeClassrooms = [];
            
            for (const classroom of classrooms.classrooms) {
                const name = typeof classroom === 'object' ? classroom.name : classroom;
                const schedule = await this.getClassroomDate(name, date);
                const isFree = !schedule.schedule.some(lesson => lesson.number === lessonNumber);
                if (isFree) {
                    freeClassrooms.push(schedule.classroom_canonical || name);
                }
            }
            
            return [...new Set(freeClassrooms)];
        },

        /**
         * Получить расписание аудитории с фильтрацией по времени
         * @param {string} classroom - Название аудитории
         * @param {string} startTime - Время начала "ЧЧ:ММ"
         * @param {string} endTime - Время конца "ЧЧ:ММ"
         * @returns {Promise<Array>} Отфильтрованные пары
         */
        getClassroomScheduleByTime: async function (classroom, startTime, endTime) {
            const schedule = await this.getClassroomWeek(classroom);
            const allLessons = Object.values(schedule.schedule).flat();
            
            return allLessons.filter(lesson => {
                const match = lesson.time.match(/\((\d{2}):(\d{2})-(\d{2}):(\d{2})\)/);
                if (!match) return false;
                const lessonStart = `${match[1]}:${match[2]}`;
                const lessonEnd = `${match[3]}:${match[4]}`;
                return lessonStart >= startTime && lessonEnd <= endTime;
            });
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        const script = document.querySelector('script[data-api-url]');
        if (script && script.dataset.apiUrl) {
            ScheduleAPI.init(script.dataset.apiUrl);
        }
    });

})();