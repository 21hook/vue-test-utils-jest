import DbTable from '@/components/DbTable'
import { render } from '@vue/server-test-utils'
import { mount } from '@vue/test-utils'
import axios from 'axios'



/* define a set of test cases for an object(component, module etc.)*/
describe('DbTable component', () => {
    // define a test case of the testing suite
    it('should render correct contents', () => {
        // Wrapper/VueComponent/Opt
        const tableOpt = mount(DbTable, {
            propsData: {
                columnNameField: { prop: ['id', 'name'], name: ['供应商ID', '供应商名称']},
                pages: {src: 'http://daily.qundian.elephtribe.com/api/procurement/wxhc/supplier/query', multiple: true},
            }

        }).vm.$options
        const tableMethods = tableOpt.methods;


        /*
            Subdomain division; choose inputs & verify outputs
                {},
                {name: []}
         */
        //expect(tableMethods.setTuple({})).toBe('');
        console.log(tableOpt && tableOpt.data)
        // console.log(tableMethods.setTuple({index: 9, row: {id: 996, name: 'Alex'}}))

        // tableMethods.setTuple({index: 9, row: {id: 996, name: 'Alex'}});





        // const App = Vue.extend(App) // create DbTable type/class
        // const app = new App().$mount() // create a DbTable instance; mount it on the DOM; instance interface
        //
        // // interface abs; more and more abs; smaller depth
        // console.log(app.$refs.table)
        // // expect(dbTable.$el.querySelector('.form-login label').textContent)


    })
})
