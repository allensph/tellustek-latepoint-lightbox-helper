
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
            attendance_input.setAttribute('placeholder', "???????????? (?????? " + capacity_min + "-" + capacity_max + " ???)")

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

                    //??????: ????????????
                    if (!conditions.some(el => mutation.oldValue.includes(el)) &&
                        mutation.target.matches(".step-changed.current-step-services.step-content-loaded")) {

                        //console.log(mutation)

                        let location_step = document.querySelector(".latepoint_location_id").value
                        if (location_step !== null && location_step !== undefined) {

                            let location = document.querySelector('[data-summary-field-name="location"][data-item-id="' + location_step + '"]')
                            //'????????????'
                            //console.log(location.dataset.summaryValue)
                            updateSummaryData('location', '????????????', location.dataset.summaryValue)
                        }
                    }

                    // ??????: ??????
                    if (!conditions.some(el => mutation.oldValue.includes(el)) &&
                        mutation.target.matches(".step-changed.current-step-agents.step-content-loaded ")) {
                        let service_step = document.querySelector(".latepoint_service_id").value
                        if (service_step !== null && service_step !== undefined) {

                            //let service = document.querySelector('[data-summary-field-name="service"][data-item-id="' + service_step + '"]').dataset.summaryValue.split('???')
                            let service = document.querySelector('.summary-box.main-box .sbc-big-item').textContent.split('???')

                            updateSummaryData('service', '??????', service[0])
                            updateSummaryData('diffculty', '??????', service[1])
                            updateSummaryData('capacity', '????????????', service[2])
                            //'??????'
                            //console.log(service.dataset.summaryValue)


                            // Min Max
                            let split_capacity = service[2].split('~')

                            capacity_min = parseInt(split_capacity[0].match(/\d+/).toString().trim())
                            capacity_max = parseInt(split_capacity[1].match(/\d+/).toString().trim())
                            //console.log(capacity_min, capacity_max)
                        }
                    }

                    // ????????????
                    if (!conditions.some(el => mutation.oldValue.includes(el)) &&
                        mutation.target.matches(".step-changed.current-step-agents.step-content-loaded ")) {

                        let messenge = document.createElement('ol')
                        let msg_content = [
                            '??????????????????????????????????????????????????????????????????????????????',
                            '|6???????????????????????????????????????|?????????????????????????????????????????????????????????',
                            '?????????????????????????????? 10 ????????????????????????????????????????????????????????????????????????',
                            '???????????????????????????????????????????????????????????????',
                            '?????????????????????????????????????????????????????????????????????????????????????????????',
                            '|???????????????????????????????????????|????????????????????????????????????????????????????????????',
                            '??????????????????????????????|??????????????????????????????????????????|???',
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
                        confirm_btn.textContent = "???????????????????????????????????????"
                    }


                    // ????????????/??????: ????????????
                    if (!conditions.some(el => mutation.oldValue.includes(el)) &&
                        mutation.target.matches(".step-changed.current-step-custom_fields_for_booking.step-content-loaded ")) {

                        attendanceVerification(capacity_min, capacity_max)

                    }

                    // ??????: ????????????
                    if (!conditions.some(el => mutation.oldValue.includes(el)) &&
                        mutation.target.matches(".step-changed.current-step-datepicker.step-content-loaded ")) {

                        // ???????????????????????? (??????????????????????????????)
                        let service = document.querySelector('.summary-box.main-box .sbc-big-item').textContent.split('???')

                        updateSummaryData('service', '??????', service[0])
                        updateSummaryData('diffculty', '??????', service[1])
                        updateSummaryData('capacity', '????????????', service[2])

                        let attendance = document.querySelector("#booking_custom_fields_cf_wtorlyzy").value
                        if (attendance !== null && attendance !== undefined) {
                            //????????????
                            //console.log(attendance)
                            updateSummaryData('attendance', '????????????', attendance)
                        }
                    }

                    // ??????: ???????????????
                    if (!conditions.some(el => mutation.oldValue.includes(el)) &&
                        mutation.target.matches(".step-changed.current-step-contact.step-content-loaded ")) {

                        let start_date = document.querySelector(".latepoint_start_date").value
                        if (start_date !== null && start_date !== undefined) {
                            //console.log(start_date)
                            updateSummaryData('booking_date', '????????????', start_date)
                        }

                        let start_time = document.querySelector(".latepoint_start_time").value
                        if (start_time !== null && start_date !== undefined) {

                            let booking_time = document.querySelector('.dp-timebox.selected .dp-label-time').textContent.replace(/(?:\r\n|\r|\n)/g, '')
                            updateSummaryData('booking_time', '????????????', booking_time)
                        }
                    }


                    // ????????????????????????????????????????????????
                    if (!conditions.some(el => mutation.oldValue.includes(el)) &&
                        mutation.target.matches(".step-changed.step-content-loaded")) {
                        //console.log(mutation)
                        createSummaryElement(Summary_Data_Filled, '.latepoint-summary-w')
                    }

                    // ??????????????????????????????????????????????????????
                    if (!mutation.oldValue.includes('step-changing') &&
                        mutation.target.matches(".step-changed.current-step-verify.step-content-loaded ")) {

                        let customer_name = document.querySelector("#customer_first_name").value
                        let customer_phone = document.querySelector("#customer_phone").value
                        let customer_email = document.querySelector("#customer_email").value

                        updateSummaryData('customer', '????????????', customer_name)
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
