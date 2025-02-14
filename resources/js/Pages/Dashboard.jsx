import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Dashboard(props, queryParams = null) {

        queryParams = props.queryParams || {};
       const onChange = (date, e) => {        
        e.preventDefault();
        queryParams['date'] = date;
        router.get(route("dashboard"),queryParams);

       };
   
 
   
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />


            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <TextInput
                        type="date"
                        name="date"    
                                        
                        onChange={(e) => onChange(e.target.value, e)}
                    />                  
                </div>

                {props.results && (
                   <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                       <div className="p-6 text-gray-900 dark:text-gray-100">
                            {props.results}
                       </div>
                   </div> 
                )}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="grid grid-cols-3">
                                <div className="col-span-2">
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overflow-auto">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white border-b-2 border-gray-500">
                                            <tr>
                                                <th className="px-3 py-2">Barangay</th>
                                                <th className="px-3 py-2">Total</th>
                                                <th className="px-3 py-2">With Permit</th>
                                            </tr>
                                        </thead>
                                        <tbody>                                           
                                            {props.barangays.map((barangay) => (
                                                <tr key={barangay.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                    <td className="px-3 py-2">{barangay.barangay}</td>
                                                    <td className="px-3 py-2">{barangay.my_applicants?.length}</td>
                                                    <td className="px-3 py-2">{barangay.my_applicants_with_permit?.length}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="">
                                    <div className="bg-blue-500 rounded m-5 p-5">
                                        Finish Today : {props.todaysFinish}
                                    </div>
                                    <div className="bg-green-600 rounded m-5 p-5">
                                        Total Applicant: {props.applicantTotal}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
