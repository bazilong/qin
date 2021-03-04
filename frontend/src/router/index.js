import Vue from 'vue'
import Router from 'vue-router'
import ctrlIndex from '../controllers/Index.vue'
import ctrlPartTime from '../controllers/PartTimePositions'
import helpInfo from '../controllers/HelpInfo.vue'
import mine from '../controllers/Mine.vue'
import weeklyForm from '../controllers/WeeklyForm'
import parttimeForm from '../controllers/ParttimeForm'
import manageLogin from '../controllers/ManageLogin'
import manage from '../ctrlManage'
import myWill from '../components/MyWill.vue'

Vue.use(Router)
window.Bus = new Vue()

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: ctrlIndex,
      meta: { title: '校内岗位' }
    },
    {
      path: '/parttime',
      component: ctrlPartTime,
      meta: { title: '兼职岗位' }
    },
    {
      path: '/help',
      component: helpInfo,
      meta: { title: '帮助信息' }
    },
    {
      path: '/mine',
      component: mine,
      meta: { title: '我的岗位' }
    },
    {
      path: '/weeklyForm',
      component: weeklyForm,
      meta: { title: '本周报名表' }
    },
    {
      path: '/parttimeForm',
      component: parttimeForm,
      meta: { title: '兼职报名表' }
    },
    {
      path: '/manage',
      component: manageLogin,
      meta: { manage: true }
    },
    {
      path: '/managepage',
      component: manage.Layout,
      children: [
        { path: 'school', component: manage.School, meta: { manage: true, login: true } },
        { path: 'applicant', name: 'applicant', component: manage.Applicant, meta: { manage: true, login: true } },
        { path: 'parttime', component: manage.Parttime, meta: { manage: true, login: true } },
        { path: 'questionnaire', component: manage.Questionnaire, meta: { manage: true, login: true } },
        { path: 'rights', component: manage.Rights, meta: { manage: true, login: true } },
        { path: 'applicant/:id', name: 'applicantDetail', component: manage.ApplicantDetail, meta: { manage: true, login: true } },
        { path: 'more', component: manage.More, meta: { manage: true, login: true } }
      ]
    },
    {
      path: '/mywill',
      component: myWill
    }
  ]
})
