
document.addEventListener('DOMContentLoaded', function () {

    let capacity_min, capacity_max

    //首頁個別遊戲預約: 取得最小/最大人數
    let games = document.querySelectorAll('.home .games-block .oxy-post')
    if (games) {
        games.forEach(game => {
            game.querySelector('.latepoint-book-button').addEventListener('click', () => {
                capacity_min = game.querySelector('.capacity').dataset.capacityMin
                capacity_max = game.querySelector('.capacity').dataset.capacityMax
            })
        })
    }

    //個別遊戲頁面預約: 取得最小/最大人數
    let single_game = document.querySelector('.single-game section#profile')
    if (single_game) {
        single_game.querySelector('.latepoint-book-button').addEventListener('click', () => {
            capacity_min = single_game.querySelector('.capacity').dataset.capacityMin
            capacity_max = single_game.querySelector('.capacity').dataset.capacityMax
        })
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

            attendanceVerification(capacity_min, capacity_max)

            const observer = new MutationObserver(function (mutationList) {

                const conditions = ["step-changing", "step-content-mid-loading", "step-content-loading", "hidden-buttons"]

                mutationList.forEach((mutation) => {

                    // 選擇: 遊戲
                    if (!conditions.some(el => mutation.oldValue.includes(el)) &&
                        mutation.target.matches(".step-changed.current-step-agents.step-content-loaded ")) {
                        let service_step = document.querySelector(".latepoint_service_id").value
                        if (service_step !== null && service_step !== undefined) {

                            let service = document.querySelector('.summary-box.main-box .sbc-big-item').textContent.split('｜')

                            // 取得最小/最大人數
                            let split_capacity = service[2].split('~')

                            capacity_min = parseInt(split_capacity[0].match(/\d+/).toString().trim())
                            capacity_max = parseInt(split_capacity[1].match(/\d+/).toString().trim())
                            //console.log(capacity_min, capacity_max)
                        }
                    }

                    // 表單提示/驗證: 參加人數
                    if (!conditions.some(el => mutation.oldValue.includes(el)) &&
                        mutation.target.matches(".step-changed.current-step-custom_fields_for_booking.step-content-loaded ")) {

                        attendanceVerification(capacity_min, capacity_max)

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
