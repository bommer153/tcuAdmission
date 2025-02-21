import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import Webcam from 'react-webcam';
import Button from '@/Components/Button';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import SelectInput from '@/Components/SelectInput';
import { useCallback } from 'react';



export default function Seat({ errors: serverErrors, auth, examRooms, seat, examDates, examTimes, success, checkSched, applicant }) {
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState([]); // Track selected item
    const [options, setOptions] = useState([]); // Store search results
    const typeaheadRef = useRef(null);
    const webcamRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [information, setInformation] = useState(null);
    const [openImage, setOpenImage] = useState(null);

    const [devices, setDevices] = useState([]);
    const [deviceId, setDeviceId] = useState("");

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const videoDevices = devices.filter((device) => device.kind === "videoinput");
            setDevices(videoDevices);
            if (videoDevices.length > 0) {
                setDeviceId(videoDevices[0].deviceId); // Set the first camera as default
            }
        });
    }, []);

    const handleChangeCamera = (event) => {
        setDeviceId(event.target.value);
    };



    const { data, setData, post, errors: formErrors } = useForm({
        id: "",
        firstName: "",
        middleName: "",
        lastName: "",
        sex: "",
        age: "",
        birthDate: "",
        birthPlace: "",
        religion: "",
        address: "",
        barangay: "",
        zipCode: "",
        contactNo: "",
        nationality: "",
        civilStatus: "",
        ethnicBackground: "",
        lrn: "",
        strand: "",
        juniorHighschool: "",
        juniorHighschoolYear: "",
        g11gwa1: "",
        g11gwa2: "",
        seniorHighchool: "",
        seniorHighchoolYear: "",
        g12gwa1: "",
        g12gwa2: "",
        firstCourse: "",
        secondCourse: "",
        thirdCourse: "",
        parentName: "",
        parentContactNo: "",
        parentComelecNo: "",
        studentComelecNo: "",

        applicantType: "",
        alsLearningCenter: "",
        alsLearningYear: "",
        alsTestingDate: "",
        alsRating: "",
        alsRemarks: "",


        examRoomNo: null,
        examSeatNo: null,
        examDate: null,
        examTime: null,

        image_upload: "",

        _method: "PUT",
    })

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        setData({
            ...data,
            image_upload: imageSrc,
            examSeatNo: seat,
            examRoomNo: examRooms.room_no,
            examDate: examDates.exam_date,
            examTime: examTimes.exam_time,
        });
    };

    const handleSearch = async (query) => {
        setQuery(query);

        if (query.length >= 2) { // Trigger search only if query length is >= 2
            try {
                const response = await axios.get('/api/examroom/search', {
                    params: { query },
                });

                if (Array.isArray(response.data)) {
                    setOptions(response.data); // Populate options with search results
                }

            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        } else {
            setOptions([]); // Clear results when query is too short
        }
    };

    const assignRoom = (e) => {
        e.preventDefault();
        post(route('examroom.assign', { examroom: examRooms.id, seats: seat, applicant: data.id }), {
            onFinish: () => {
                toast.success(success || 'Room Assigned');
            },
        });
    }

    const { data: removeSchedData, setData:setRemoveSchedData, put:removeSchedPut, errors: removeSchedError } = useForm({       
        _method: "PUT",
    })

    const removeSched = (id) => {
        if (!window.confirm("Are you sure you want to remove schedule?")) return;      
        post(route('applicant.removeSched',id));
      };

    const selectApplicant = (item) => {

        typeaheadRef.current.clear();
        setInformation(true);

      
        setCapturedImage("");
        setData({
            ...data,
            id: item.id || "",
            firstName: item.first_name || "",
            middleName: item.middle_name || "",
            lastName: item.last_name || "",
            sex: item.sex || "",
            age: item.age || "",
            birthDate: item.dob || "",
            birthPlace: item.birth_place || "",
            religion: item.religion || "",
            address: item.address || "",
            barangay: item.barangay || "",
            zipCode: item.zip_code || "",
            contactNo: item.contact_no || "",
            nationality: item.nationality || "",
            civilStatus: item.civil_status || "",
            ethnicBackground: item.ethnic_background || "",
            lrn: item.lrn || "",
            strand: item.strand || "",
            juniorHighschool: item.junior_high_school || "",
            juniorHighschoolYear: item.junior_high_school_year_graduated || "",
            g11gwa1: item.g11_gwa1 || "",
            g11gwa2: item.g11_gwa2 || "",
            seniorHighschool: item.senior_high_school || "",
            seniorHighschoolYear: item.senior_high_school_year_graduated || "",
            g12gwa1: item.g12_gwa1 || "",
            g12gwa2: item.g12_gwa2 || "",
            firstCourse: item.first_course || "",
            secondCourse: item.second_course || "",
            thirdCourse: item.third_course || "",
            parentName: item.name_of_parent || "",
            parentContactNo: item.parent_contact_no || "",
            parentComelecNo: item.parent_comelec_no || "",
            studentComelecNo: item.student_comelec_no || "",
            remarks: item.remarks || "",
            status: item.status || "",
            validatedBy: item.validated_by?.name || "",

            applicantType: item.applicantType || "",
            alsLearningCenter: item.als_learning_center || "",
            alsLearningYear: item.als_learning_center_year_graduated || "",
            alsTestingDate: item.als_accreditation_equivalent_testing_date || "",
            alsRating: item.als_accreditation_equivalent_rating || "",
            alsRemarks: item.als_accreditation_equivalent_remarks || "",



            examRoomNo: item.exam_room_no || null,
            examSeatNo: item.exam_seat_no || null,
            examDate: item.exam_date || null,
            examTime: item.exam_time || null,


        });


        if (item.exam_room_no && item.exam_seat_no && item.exam_date && item.exam_time) {
            setOpenImage(true);
        } else {
            setOpenImage(null);
        }


    }



    return (
        <AuthenticatedLayout
            auth={auth}
            errors={serverErrors}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                <Link className="hover:underline" href={route('examroom.show', examRooms.id)}><FontAwesomeIcon icon={faArrowLeft} /> Room No :  {examRooms.room_no} </Link>
                - Seat : {seat}</h2>}
        >
            <Head title={`Room: ${examRooms.room_no} - ${seat}`} />

            <div className="py-12">


             

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mb-5">

                {success && (
                        <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
                            {success}
                        </div>
                    )}

                    {!applicant && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <Typeahead
                                    id="typeahead-search"
                                    onChange={setSelected}
                                    selected={selected}
                                    labelKey={(option) => `${option.first_name} ${option.middle_name || ''} ${option.last_name}`}
                                    isFocused={true}
                                    minLength={2} // Minimum characters before suggesting
                                    maxResults={50} // Max number of results to show
                                    onInputChange={handleSearch}
                                    options={options} // Options will be populated dynamically
                                    placeholder="Search for a name..."
                                    ref={typeaheadRef}
                                    inputProps={{
                                        className:
                                            "w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm",
                                    }}

                                    renderMenu={(results) => (
                                        <ul className="border border-gray-300 rounded-md shadow-lg bg-white mt-1 overflow-auto" style={{ height: 500 }}>
                                            {results.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="text-black px-4 py-2 cursor-pointer hover:bg-blue-100"
                                                    onDoubleClick={() => selectApplicant(item)}
                                                >
                                                    {item.first_name} {item.middle_name} {item.last_name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                />
                            </div>
                        </div>
                    )}

                </div>

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-5">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="grid grid-cols-2">
                                <div>
                                    <h1><span className="font-bold">Exam Date :</span> {examDates.exam_date}</h1>
                                    <h1><span className="font-bold">Exam Time :</span> {examTimes.exam_time}</h1>
                                </div>
                                <div>
                                    <h1>Room No : {examRooms.room_no}</h1>
                                    <h1>Seat No : {seat}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {applicant && (
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <a href={route('applicant.show', applicant.id)} target="_blank" className="hover:underline mb-5">
                                    Edit Applicant
                                </a>


                                <br></br>
                                <div className="grid grid-cols-2">
                                    <div>
                                        <h1><span className="font-bold">First Name :</span> {applicant.first_name}</h1>
                                        <h1><span className="font-bold">Middle Name :</span> {applicant.middle_name}</h1>
                                        <h1><span className="font-bold">Last Name :</span> {applicant.last_name} </h1>
                                        <hr className="mb-2 mt-2 w-4/5"></hr>
                                        <h1><span className="font-bold">Sex :</span> {applicant.sex} </h1>
                                        <h1><span className="font-bold">Age :</span> {applicant.age} </h1>
                                        <h1><span className="font-bold">Birth Date :</span> {applicant.dob} </h1>
                                        <h1><span className="font-bold">Birth Place :</span> {applicant.birth_place} </h1>
                                        <h1><span className="font-bold">Religion :</span> {applicant.religion} </h1>
                                        <h1><span className="font-bold">Address :</span> {applicant.address} </h1>
                                        <h1><span className="font-bold">Barangay :</span> {applicant.barangay} </h1>
                                        <h1><span className="font-bold">Zip Code :</span> {applicant.zip_code} </h1>
                                        <h1><span className="font-bold">Contact No :</span> {applicant.contact_no} </h1>
                                        <h1><span className="font-bold">Nationality :</span> {applicant.nationality} </h1>
                                        <h1><span className="font-bold">Civil Status :</span> {applicant.civil_status} </h1>
                                        <h1><span className="font-bold">Ethnic Background :</span> {applicant.ethnic_background} </h1>
                                        <hr className="mb-2 mt-2 w-4/5"></hr>
                                        <h1><span className="font-bold">Parent's Name :</span> {applicant.name_of_parent} </h1>
                                        <h1><span className="font-bold">Parent's Contact No. :</span> {applicant.parent_contact_no} </h1>
                                        <h1><span className="font-bold">Parent's Comelec No. :</span> {applicant.parent_comelec_no} </h1>
                                        <h1><span className="font-bold">Student Comelec No. :</span> {applicant.student_comelec_no} </h1>
                                    </div>
                                    {applicant.applicantType == 'Freshmen' && (
                                        <div>
                                            <h1><span className="font-bold">LRN :</span> {applicant.lrn}</h1>
                                            <h1><span className="font-bold">Strand :</span> {applicant.strand}</h1>
                                            <br></br>
                                            <h1><span className="font-bold">Junior High School :</span> {applicant.junior_high_school} </h1>
                                            <h1><span className="font-bold">Junior High School Year Graduated:</span> {applicant.junior_high_school_year_graduated} </h1>
                                            <br></br>
                                            <h1><span className="font-bold">Senior High School :</span> {applicant.senior_high_school} </h1>
                                            <h1><span className="font-bold">Senior High School Year Graduated:</span> {applicant.senior_high_school_year_graduated} </h1>
                                            <h1><span className="font-bold">• Grade 11 - 1st Sem GWA :</span> {applicant.g11_gwa1} </h1>
                                            <h1><span className="font-bold">• Grade 11 - 2st Sem GWA :</span> {applicant.g11_gwa2} </h1>
                                            <h1><span className="font-bold">• Grade 12 - 1st Sem GWA :</span> {applicant.g12_gwa1} </h1>
                                            <h1><span className="font-bold">• Grade 12 - 2st Sem GWA :</span> {applicant.g12_gwa2} </h1>
                                            <hr className="mb-2 mt-2 w-4/5"></hr>
                                            <h1><span className="font-bold">First Choice :</span> {applicant.first_course} </h1>
                                            <h1><span className="font-bold">Second Choice :</span> {applicant.second_course} </h1>
                                            <h1><span className="font-bold">Third Choice : </span> {applicant.third_course} </h1>
                                            <br></br>
                                            <h1><span className="font-bold">Validated By: </span> {applicant.validated_by?.name} </h1>
                                            <h1><span className="font-bold">Status :</span> {applicant.status} </h1>
                                            <h1><span className="font-bold">Remarks : </span> {applicant.remarks} </h1>
                                        </div>
                                    )}

                                    {applicant.applicantType == 'ALS' && (
                                        <div>
                                            <h1><span className="font-bold">AlS Learning Center:</span> {applicant.als_learning_center} </h1>
                                            <h1><span className="font-bold">ALS Year Graduated:</span> {applicant.als_learning_center_year_graduated} </h1>
                                            <h1><span className="font-bold">A&E Testing Date </span> {applicant.als_accreditation_equivalent_testing_date} </h1>
                                            <h1><span className="font-bold">A&E Rating </span> {applicant.als_accreditation_equivalent_rating} </h1>
                                            <h1><span className="font-bold">A&E Remarks :</span> {applicant.als_accreditation_equivalent_remarks} </h1>
                                            <hr className="mb-2 mt-2 w-4/5"></hr>
                                            <h1><span className="font-bold">First Choice :</span> {applicant.first_course} </h1>
                                            <h1><span className="font-bold">Second Choice :</span> {applicant.second_course} </h1>
                                            <h1><span className="font-bold">Third Choice : </span> {applicant.third_course} </h1>
                                            <br></br>
                                            <h1><span className="font-bold">Validated By: </span> {applicant.validated_by?.name} </h1>
                                            <h1><span className="font-bold">Status :</span> {applicant.status} </h1>
                                            <h1><span className="font-bold">Remarks : </span> {applicant.remarks} </h1>
                                        </div>
                                    )}
                                </div>
                                <hr className="mb-5 mt-5"></hr>

                                <div className="grid grid-cols-2">
                                    {setOpenImage && (
                                        <div className="mr-5">
                                            <img src={`../../storage/snap/${applicant.image_captured}`} alt="Captured" className="border rounded-md" />
                                        </div>
                                    )}

                                    {!setOpenImage && (
                                        <div className="mr-5">
                                            <Webcam
                                                audio={false}
                                                ref={webcamRef}
                                                screenshotFormat="image/jpeg"
                                                videoConstraints={{
                                                    width: 1280,
                                                    height: 720,
                                                    facingMode: "user", // Use "environment" for the rear camera
                                                }}
                                                className="w-full h-auto border rounded-md"
                                            />

                                        </div>
                                    )}

                                    <div>

                                        {capturedImage && (
                                            <div className="ml-5">
                                                <img src={capturedImage} alt="Captured" className="border rounded-md" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <div className="bg-emerald-900 p-4 rounded mb-5 grid grid-cols-2">
                                        <h1 className="col-span-2">APPLICANT ASSIGN TO THIS SCHEDULE</h1>
                                        <h1><span className="font-bold">Exam Date:</span> {applicant.exam_date} </h1>
                                        <h1><span className="font-bold">Exam Time :</span> {applicant.exam_time} </h1>
                                        <h1><span className="font-bold">Exam Room No : </span> {applicant.exam_room_no} </h1>
                                        <h1><span className="font-bold">Exam Seat No : </span> {applicant.exam_seat_no} </h1>
                                        <a href={route('pdf.examPermit', applicant.id)} target="_blank">
                                            <Button className="mt-2">Print Exam Permit</Button>
                                        </a>
                                        <Button  onClick={() => removeSched(applicant.id)} className="mt-2 bg-red-500 hover:bg-gray-500 w-1/3">Remove Schedule</Button>
                                        
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {information && !applicant && (
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <a href={route('applicant.show', data.id)} target="_blank" className="hover:underline mb-5">
                                    Edit Applicant
                                </a>


                                <br></br>
                                <div className="grid grid-cols-2">
                                    <div>
                                        <h1><span className="font-bold">First Name :</span> {data.firstName}</h1>
                                        <h1><span className="font-bold">Middle Name :</span> {data.middleName}</h1>
                                        <h1><span className="font-bold">Last Name :</span> {data.lastName} </h1>
                                        <hr className="mb-2 mt-2 w-4/5"></hr>
                                        <h1><span className="font-bold">Sex :</span> {data.sex} </h1>
                                        <h1><span className="font-bold">Age :</span> {data.age} </h1>
                                        <h1><span className="font-bold">Birth Date :</span> {data.birthDate} </h1>
                                        <h1><span className="font-bold">Birth Place :</span> {data.birthPlace} </h1>
                                        <h1><span className="font-bold">Religion :</span> {data.religion} </h1>
                                        <h1><span className="font-bold">Address :</span> {data.address} </h1>
                                        <h1><span className="font-bold">Barangay :</span> {data.barangay} </h1>
                                        <h1><span className="font-bold">Zip Code :</span> {data.zipCode} </h1>
                                        <h1><span className="font-bold">Contact No :</span> {data.contactNo} </h1>
                                        <h1><span className="font-bold">Nationality :</span> {data.nationality} </h1>
                                        <h1><span className="font-bold">Civil Status :</span> {data.civilStatus} </h1>
                                        <h1><span className="font-bold">Ethnic Background :</span> {data.ethnicBackground} </h1>
                                        <hr className="mb-2 mt-2 w-4/5"></hr>
                                        <h1><span className="font-bold">Parent's Name :</span> {data.parentName} </h1>
                                        <h1><span className="font-bold">Parent's Contact No. :</span> {data.parentContactNo} </h1>
                                        <h1><span className="font-bold">Parent's Comelec No. :</span> {data.parentComelecNo} </h1>
                                        <h1><span className="font-bold">Student Comelec No. :</span> {data.studentComelecNo} </h1>
                                    </div>
                                    {data.applicantType == 'Freshmen' && (
                                        <div>
                                            <h1><span className="font-bold">LRN :</span> {data.lrn}</h1>
                                            <h1><span className="font-bold">Strand :</span> {data.strand}</h1>
                                            <br></br>
                                            <h1><span className="font-bold">Junior High School :</span> {data.juniorHighschool} </h1>
                                            <h1><span className="font-bold">Junior High School Year Graduated:</span> {data.juniorHighschoolYear} </h1>
                                            <br></br>
                                            <h1><span className="font-bold">Senior High School :</span> {data.seniorHighschool} </h1>
                                            <h1><span className="font-bold">Senior High School Year Graduated:</span> {data.seniorHighschoolYear} </h1>
                                            <h1><span className="font-bold">• Grade 11 - 1st Sem GWA :</span> {data.g11gwa1} </h1>
                                            <h1><span className="font-bold">• Grade 11 - 2st Sem GWA :</span> {data.g11gwa2} </h1>
                                            <h1><span className="font-bold">• Grade 12 - 1st Sem GWA :</span> {data.g12gwa1} </h1>
                                            <h1><span className="font-bold">• Grade 12 - 2st Sem GWA :</span> {data.g12gwa2} </h1>
                                            <hr className="mb-2 mt-2 w-4/5"></hr>
                                            <h1><span className="font-bold">First Choice :</span> {data.firstCourse} </h1>
                                            <h1><span className="font-bold">Second Choice :</span> {data.secondCourse} </h1>
                                            <h1><span className="font-bold">Third Choice : </span> {data.thirdCourse} </h1>
                                            <br></br>
                                            <h1><span className="font-bold">Validated By: </span> {data.validatedBy} </h1>
                                            <h1><span className="font-bold">Status :</span> {data.status} </h1>
                                            <h1><span className="font-bold">Remarks : </span> {data.remarks} </h1>
                                        </div>
                                    )}

                                    {data.applicantType == 'ALS' && (
                                        <div>
                                            <h1><span className="font-bold">AlS Learning Center:</span> {data.alsLearningCenter} </h1>
                                            <h1><span className="font-bold">ALS Year Graduated:</span> {data.alsLearningCenter} </h1>
                                            <h1><span className="font-bold">A&E Testing Date </span> {data.alsTestingDate} </h1>
                                            <h1><span className="font-bold">A&E Rating </span> {data.alsRating} </h1>
                                            <h1><span className="font-bold">A&E Remarks :</span> {data.alsRemarks} </h1>
                                            <hr className="mb-2 mt-2 w-4/5"></hr>
                                            <h1><span className="font-bold">First Choice :</span> {data.firstCourse} </h1>
                                            <h1><span className="font-bold">Second Choice :</span> {data.secondCourse} </h1>
                                            <h1><span className="font-bold">Third Choice : </span> {data.thirdCourse} </h1>
                                            <br></br>
                                            <h1><span className="font-bold">Validated By: </span> {data.validatedBy} </h1>
                                            <h1><span className="font-bold">Status :</span> {data.status} </h1>
                                            <h1><span className="font-bold">Remarks : </span> {data.remarks} </h1>
                                        </div>
                                    )}

                                </div>
                                <hr className="mb-5 mt-5"></hr>
                                <h1 className="text-2xl text-red-500">{formErrors.image_upload} </h1>
                                <div className="grid grid-cols-2">


                                    {!openImage && (
                                        <div className="mr-5">
                                            <Webcam
                                                audio={false}
                                                ref={webcamRef}
                                                screenshotFormat="image/jpeg"
                                                videoConstraints={{
                                                    deviceId: deviceId ? { exact: deviceId } : undefined,
                                                    width: 1280,
                                                    height: 720,
                                                    facingMode: "user", // Use "environment" for the rear camera
                                                }}
                                                className="w-full h-auto border rounded-md"
                                            />
                                            <SelectInput onChange={handleChangeCamera} value={deviceId} className="mr-5">
                                                {devices.map((device) => (
                                                    <option key={device.deviceId} value={device.deviceId}>
                                                        {device.label || `Camera ${device.deviceId}`}
                                                    </option>
                                                ))}
                                            </SelectInput>
                                            <Button
                                                onClick={capture}
                                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                                            >
                                                Capture Photo
                                            </Button>
                                        </div>
                                    )}


                                    <div>

                                        {capturedImage && (
                                            <div className="ml-5">
                                                <img src={capturedImage} alt="Captured" className="border rounded-md" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <hr className='mb-5 mt-5'></hr>
                                <div>

                                    {openImage && (
                                        <div className="bg-emerald-900 p-4 rounded mb-5 grid grid-cols-2">
                                            <h1 className="col-span-2">APPLICANT ASSIGN TO THIS SCHEDULE</h1>
                                            <h1><span className="font-bold">Exam Date:</span> {data.examDate} </h1>
                                            <h1><span className="font-bold">Exam Time :</span> {data.examDate} </h1>
                                            <h1><span className="font-bold">Exam Room No : </span> {data.examRoomNo} </h1>
                                            <h1><span className="font-bold">Exam Seat No : </span> {data.examSeatNo} </h1>
                                            <a href={route('pdf.examPermit', data.id)} target="_blank">
                                                <Button className="mt-2">Print Exam Permit</Button>
                                            </a>
                                        </div>
                                    )}
                                    {console.log(data)}
                                    {!openImage && (
                                        <form
                                            onSubmit={assignRoom}
                                        >
                                            <Button disabled={data.validatedBy === "" || data.status !== "Complete"}>Assign To this Room</Button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
