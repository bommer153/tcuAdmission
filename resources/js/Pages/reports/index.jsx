import Button from '@/Components/Button';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Reports({ auth, errors, examDates, examTimes, examRooms }) {

    const { data, setData } = useForm({
        date: "",
        time: "",
        room: "",
    })

    const { data:counts, setData:setCounts } = useForm({
        count : ""
    })

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Reports</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="grid grid-cols-2 px-10">
                    <div className="px-5">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <form className="grid grid-cols-3">
                                    <div>
                                        <InputLabel htmlFor="date" value="Date" />
                                        <SelectInput
                                            id="date"
                                            name="examDate"
                                            value={data.date}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("date", e.target.value)}
                                        >
                                            <option>--SELECT DATE--</option>
                                            {examDates.map((examDate) => (
                                                <option key={examDate.id} value={examDate.exam_date}>{examDate.exam_date}</option>
                                            ))}
                                        </SelectInput>
                                        <InputError message={errors.examDate} className="mt-2" />
                                    </div>

                                    <div className="ml-3">
                                        <InputLabel htmlFor="time" value="Shift" />
                                        <SelectInput
                                            id="time"
                                            name="examTime"
                                            value={data.time}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("time", e.target.value)}
                                        >
                                            <option>--SELECT TIME--</option>
                                            {examTimes.map((examTime) => (
                                                <option key={examTime.id} value={examTime.exam_time}>{examTime.exam_time}</option>
                                            ))}
                                        </SelectInput>
                                        <InputError message={errors.examTime} className="mt-2" />
                                    </div>

                                    <div className="ml-3">
                                        <InputLabel htmlFor="room" value="Room" />
                                        <SelectInput
                                            id="room"
                                            name="room"
                                            value={data.room}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("room", e.target.value)}
                                        >
                                            <option>--SELECT EXAM ROOM--</option>
                                            {examRooms.map((examRoom) => (
                                                <option key={examRoom.id} value={examRoom.room_no}>{examRoom.room_no}</option>
                                            ))}
                                        </SelectInput>
                                        <InputError message={errors.room} className="mt-2" />
                                    </div>                                    
                                </form>
                                <div className="mt-5">
                                    <a href={route('pdf.seatRecord',{date:data.date, time:data.time, room:data.room })} target="_blank">  
                                        <Button className="mr-3"> Seat Report </Button>
                                    </a>
                                  
                                    <a href={route('pdf.seatPlan',{date:data.date, time:data.time, room:data.room })} target="_blank">  
                                        <Button className="mr-3"> Seat Plan </Button>
                                    </a>
                                </div>
                                
                            </div>
                        </div>
                    </div>

                    <div className="px-5">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <form>
                                    <div>
                                        <InputLabel htmlFor="count" value="Count" />
                                        <TextInput
                                            id="count"
                                            name="count"
                                            value={counts.count}
                                            type="number"
                                            className="mt-1 block w-full"
                                            onChange={(e) => setCounts("count", e.target.value)}
                                        >                                           
                                        </TextInput>
                                        <InputError message={errors.count} className="mt-2" />
                                    </div>                                
                                </form>
                                <div className="mt-5">                                    
                                    <a href={route('pdf.result',{counts:counts.count })} target="_blank">  
                                        <Button className="mr-3">Print Exam Result </Button>
                                    </a>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
