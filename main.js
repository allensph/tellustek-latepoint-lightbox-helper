
document.addEventListener('DOMContentLoaded', function () {

    let capacity_min, capacity_max

    let games = document.querySelectorAll('.home .games-block .oxy-post')
    if (games) {
        games.forEach(game => {
            game.querySelector('.latepoint-book-button').addEventListener('click', () => {
                capacity_min = game.querySelector('.capacity').dataset.capacityMin
                capacity_max = game.querySelector('.capacity').dataset.capacityMax
            })
        })
    }

    let single_game = document.querySelector('.single-game section#profile')
    if (single_game) {
        single_game.querySelector('.latepoint-book-button').addEventListener('click', () => {
            capacity_min = single_game.querySelector('.capacity').dataset.capacityMin
            capacity_max = single_game.querySelector('.capacity').dataset.capacityMax
        })
    }

    function updateSummaryData(currentStep, boxTitle, boxContent) {
        let obj = Summary_Data.find(obj => obj.step === currentStep)
        obj.title = boxTitle
        obj.content = boxContent

        Summary_Data_Filled = Summary_Data.filter(obj => Object.keys(obj).length === 3)
        //console.log(Summary_Data_Filled)
    }
    function createSummaryElement(array, selector) {

        let container = document.querySelector(selector)
        let previous_summary = container.querySelector('.custom-summary-contents')
        if (previous_summary !== null && typeof (previous_summary) !== undefined) {
            container.removeChild(previous_summary)
        }

        let custom_summary = document.createElement('div')
        custom_summary.classList.add('custom-summary-contents')

        array.forEach(item => {
            let box = document.createElement('div')
            box.classList.add('summary-box', 'custom')

            let box_heading = document.createElement('div')
            box_heading.classList.add('summary-box-heading')
            box_heading.textContent = item.title
            box.append(box_heading)

            let box_content = document.createElement('div')
            box_content.classList.add('summary-box-content')
            box_content.textContent = item.content
            box.append(box_content)

            custom_summary.append(box)
        })


        container.append(custom_summary)
    }
    function attendanceVerification(min, max) {
        let attendance_input = document.querySelector("#booking_custom_fields_cf_wtorlyzy")
        if (attendance_input) {
            attendance_input.setAttribute('placeholder', "參加人數 (限制 " + capacity_min + "-" + capacity_max + " 人)")

            attendance_input.addEventListener('keypress', (e) => {
                let code = e.which ? e.which : e.keyCode
                if ((code !== 46 && code > 31 && (code < 48 || code > 57)) || (code === 46 && e.target.value.indexOf('.') > -1)) {
                    e.preventDefault()
                }
            })
            attendance_input.addEventListener('keyup', () => {

                if (parseInt(attendance_input.value) > capacity_max) {
                    attendance_input.value = capacity_max
                    attendance_input.setAttribute('value', capacity_max)
                }
                if (parseInt(attendance_input.value) < capacity_min) {
                    attendance_input.value = capacity_min
                    attendance_input.setAttribute('value', capacity_min)
                }
            })
        }
    }
    document.addEventListener('DOMNodeInserted', function (event) {

        // Latepoint Lightbox Opened
        if (event.target.classList == '' || event.target.classList == undefined) {
            return
        }

        if (event.target.classList.contains("latepoint-lightbox-w")) {

            //console.log('Latepoint Lightbox Opened.')

            Summary_Data = [
                {
                    'step': 'service'
                },
                {
                    'step': 'diffculty'
                },
                {
                    'step': 'capacity'
                },
                {
                    'step': 'attendance'
                },
                {
                    'step': 'booking_date'
                },
                {
                    'step': 'booking_time'
                },
                {
                    'step': 'location'
                },
                {
                    'step': 'customer'
                },
            ]
            Summary_Data_Filled = []

            attendanceVerification(capacity_min, capacity_max)

            const observer = new MutationObserver(function (mutationList) {

                const conditions = ["step-changing", "step-content-mid-loading", "step-content-loading", "hidden-buttons"]

                mutationList.forEach((mutation) => {

                    //選擇: 營業地點
                    if (!conditions.some(el => mutation.oldValue.includes(el)) &&
                        mutation.target.matches(".step-changed.current-step-services.step-content-loaded")) {

                        //console.log(mutation)

                        let location_step = document.querySelector(".latepoint_location_id").value
                        if (location_step !== null && location_step !== undefined) {

                            let location = document.querySelector('[data-summary-field-name="location"][data-item-id="' + location_step + '"]')
                            //'營業地點'
                            //console.log(location.dataset.summaryValue)
                            updateSummaryData('location', '預約地點', location.dataset.summaryValue)
                        }
                    }

                    // 選擇: 遊戲
                    if (!conditions.some(el => mutation.oldValue.includes(el)) &&
                        mutation.target.matches(".step-changed.current-step-agents.step-content-loaded ")) {
                        let service_step = document.querySelector(".latepoint_service_id").value
                        if (service_step !== null && service_step !== undefined) {

                            //let service = document.querySelector('[data-summary-field-name="service"][data-item-id="' + service_step + '"]').dataset.summaryValue.split('｜')
                            let service = document.querySelector('.summary-box.main-box .sbc-big-item').textContent.split('｜')

                            updateSummaryData('service', '遊戲', service[0])
                            updateSummaryData('diffculty', '難度', service[1])
                            updateSummaryData('capacity', '建議人數', service[2])
                            //'遊戲'
                            //console.log(service.dataset.summaryValue)


                            // Min Max
                            let split_capacity = service[2].split('~')

                            capacity_min = parseInt(split_capacity[0].match(/\d+/).toString().trim())
                            capacity_max = parseInt(split_capacity[1].match(/\d+/).toString().trim())
                            //console.log(capacity_min, capacity_max)
                        }
                    }

                    // 注意事項
                    if (!conditions.some(el => mutation.oldValue.includes(el)) &&
                        mutation.target.matches(".step-changed.current-step-agents.step-content-loaded ")) {

                        let messenge = document.createElement('ol')
                        let msg_content = [
                            '參加本遊戲請著輕便、好活動的服裝，貴重物品請自行保管',
                            '|6歲以下孩童進入，請事先通知|，並請家長妥善照顧，避免影響到其他玩家',
                            '請務必準時到場，遲到 10 分鐘以上視為自動放棄參與權益並且不提供退換票服務',
                            '遊戲期間禁止攜入手機與相機或以任何形式紀錄',
                            '本遊戲雖已有足夠安全措施，遊玩時仍須注意安全，避免做出危險行為',
                            '|遊戲過程請遵照工作人員指示|，若因違規造成物品損壞，得視情況要求賠償',
                            '為確保完整遊戲品質，|請依照遊戲建議的人數預約報名|。',
                        ]
                        msg_content.forEach(msg => {
                            let item = document.createElement('li')

                            if (msg.includes('|')) {
                                let msg_array = msg.split('|')
                                let underline = document.createElement('u')
                                underline.textContent = msg_array[1]
                                item.textContent = msg_array[0]
                                item.append(underline)
                                item.append(msg_array[2])
                            } else {
                                item.textContent = msg
                            }

                            messenge.append(item)
                        })

                        let agent_step = document.querySelector(".step-agents-w")
                        let confirm_btn = agent_step.querySelector(".os-item-name")
                        agent_step.prepend(messenge)
                        confirm_btn.textContent = "我已閱讀並同意以上注意事項"
                    }


                    // 表單提示/驗證: 參加人數
                    if (!conditions.some(el => mutation.oldValue.includes(el)) &&
                        mutation.target.matches(".step-changed.current-step-custom_fields_for_booking.step-content-loaded ")) {

                        attendanceVerification(capacity_min, capacity_max)

                    }

                    // 選擇: 參加人數
                    if (!conditions.some(el => mutation.oldValue.includes(el)) &&
                        mutation.target.matches(".step-changed.current-step-datepicker.step-content-loaded ")) {

                        // 再次更新遊戲資訊 (用於單一遊戲預約按鈕)
                        let service = document.querySelector('.summary-box.main-box .sbc-big-item').textContent.split('｜')

                        updateSummaryData('service', '遊戲', service[0])
                        updateSummaryData('diffculty', '難度', service[1])
                        updateSummaryData('capacity', '建議人數', service[2])

                        let attendance = document.querySelector("#booking_custom_fields_cf_wtorlyzy").value
                        if (attendance !== null && attendance !== undefined) {
                            //參加人數
                            //console.log(attendance)
                            updateSummaryData('attendance', '預約人數', attendance)
                        }
                    }

                    // 選擇: 日期與時間
                    if (!conditions.some(el => mutation.oldValue.includes(el)) &&
                        mutation.target.matches(".step-changed.current-step-contact.step-content-loaded ")) {

                        let start_date = document.querySelector(".latepoint_start_date").value
                        if (start_date !== null && start_date !== undefined) {
                            //console.log(start_date)
                            updateSummaryData('booking_date', '預約日期', start_date)
                        }

                        let start_time = document.querySelector(".latepoint_start_time").value
                        if (start_time !== null && start_date !== undefined) {

                            let booking_time = document.querySelector('.dp-timebox.selected .dp-label-time').textContent.replace(/(?:\r\n|\r|\n)/g, '')
                            updateSummaryData('booking_time', '預約時間', booking_time)
                        }
                    }


                    // 每遇換頁，更新預約摘要至右側欄位
                    if (!conditions.some(el => mutation.oldValue.includes(el)) &&
                        mutation.target.matches(".step-changed.step-content-loaded")) {
                        //console.log(mutation)
                        createSummaryElement(Summary_Data_Filled, '.latepoint-summary-w')
                    }

                    // 更新客戶資料，插入預約摘要至中間欄位
                    if (!mutation.oldValue.includes('step-changing') &&
                        mutation.target.matches(".step-changed.current-step-verify.step-content-loaded ")) {

                        let customer_name = document.querySelector("#customer_first_name").value
                        let customer_phone = document.querySelector("#customer_phone").value
                        let customer_email = document.querySelector("#customer_email").value

                        updateSummaryData('customer', '預約客戶', customer_name)
                        createSummaryElement(Summary_Data_Filled, '.confirmation-info-w')

                    }
                })
            })

            const div = document.querySelector(".latepoint-booking-form-element")
            observer.observe(div, {
                attributes: true,
                attributeFilter: ["class"],
                attributeOldValue: true,
            })

        }

    })
})
