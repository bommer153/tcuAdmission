import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';


export default function ExamRoom(props) {

    
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Exam Room</h2>}
        >
            <Head title="Exam Room" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mb-5">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                        <h1><span className="font-bold">Exam Date :</span> {props.examDate.exam_date}</h1>
                        <h1><span className="font-bold">Exam Time :</span> {props.examTime.exam_time}</h1>
                        </div>
                    </div>
                </div>


                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className='grid grid-cols-5'>
                                {props.examRooms.map((examRoom) => (
                                    <Link href={route('examroom.show', examRoom.id)}>
                                        <div className="flex items-center justify-center mb-5 ml-5 dark:bg-red-500 h-40 w-40  sm:rounded-lg cursor-pointer" key={examRoom.id}>
                                            <div className="py-5 px-5 text-gray-900 dark:text-gray-100">
                                                <span className="text-gray-100">{examRoom.applicantCount}/35
                                                </span>
                                                <h1 className="text-4xl align-center">{examRoom.room_no}</h1>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
