import Button from '@/Components/Button';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Pagination from '@/Components/pagination';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { format } from "date-fns";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export default function Show(props) {

 

    const { data, setData, post, errors } = useForm({
        firstName: props.applicant.first_name || "",
        middleName: props.applicant.middle_name || "",
        lastName: props.applicant.last_name || "",
        sex: props.applicant.sex || "",
        age: props.applicant.age || "",
        birthDate: props.applicant.dob || "",
        birthPlace: props.applicant.birth_place || "",
        religion: props.applicant.religion || "",
        address: props.applicant.address || "",
        barangay: props.applicant.barangay || "",
        zipCode: props.applicant.zip_code || "",
        contactNo: props.applicant.contact_no || "",
        nationality: props.applicant.nationality || "",
        civilStatus: props.applicant.civil_status || "",
        ethnicBackground: props.applicant.ethnic_background || "",
        lrn: props.applicant.lrn || "",
        strand: props.applicant.strand || "",
        juniorHighschool: props.applicant.junior_high_school || "",
        juniorHighschoolYear: props.applicant.junior_high_school_year_graduated || "",
        g11gwa1: props.applicant.g11_gwa1 || "",
        g11gwa2: props.applicant.g11_gwa2 || "",
        seniorHighschool: props.applicant.senior_high_school || "",
        seniorHighschoolYear: props.applicant.senior_high_school_year_graduated || "",
        g12gwa1: props.applicant.g12_gwa1 || "",
        g12gwa2: props.applicant.g12_gwa2 || "",
        firstCourse: props.applicant.first_course || "",
        secondCourse: props.applicant.second_course || "",
        thirdCourse: props.applicant.third_course || "",
        parentName: props.applicant.name_of_parent || "",
        parentContactNo: props.applicant.parent_contact_no || "",
        parentComelecNo: props.applicant.parent_comelec_no || "",
        studentComelecNo: props.applicant.student_comelec_no || "",
        remarks: props.applicant.remarks || "",
        status: props.applicant.status || "",
        
        applicantType: props.applicantType || "",
        alsLearningCenter: props.applicant.als_learning_center || "",
        alsLearningYear: props.applicant.als_learning_center_year_graduated || "",
        alsTestingDate: props.applicant.als_accreditation_equivalent_testing_date || "",
        alsRating: props.applicant.als_accreditation_equivalent_rating || "",
        alsRemarks: props.applicant.als_accreditation_equivalent_remarks || "",

        _method: "PUT",

       

    });




    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('applicant.update', props.applicant.id),{
            onFinish: () => {
                if(!errors){
                    toast.success(props.success || 'Applicant Updated');
                }else{
                    toast.error(errors || 'Something went wrong');
                }
               console.log(props.success)
            },
        });
    }

    const onSubmitRemarks = (e) => {
        e.preventDefault();
        post(route('applicant.updateRemarks', props.applicant.id), {
            remarks: data.remarks,
            status: data.status,
        });
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                <Link href={route('applicant.index')} className="hover:underline">
                    <FontAwesomeIcon icon={faArrowLeft} /> Applicant
                </Link> / {props.applicant.id}</h2>}

        >
            <Head title={`${props.applicant.first_name} ${props.applicant.last_name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                
                    {props.success && (
                        <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
                            {props.success}
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-5">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form
                                onSubmit={onSubmitRemarks}
                                className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg grid grid-cols-3 gap-12"
                            >
                                <div className="mt-4 col-span-2">
                                    <InputLabel htmlFor="remarks" value="Remarks" />
                                    <TextInput
                                        id="remarks"
                                        type="text"
                                        name="remarks"
                                        value={data.remarks}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("remarks", e.target.value)}
                                    />
                                    <InputError message={errors.remarks} className="mt-2" />
                                </div>

                                <div className="mt-4 ">
                                    <InputLabel htmlFor="status" value="Status" />
                                    <SelectInput
                                        id="status"
                                        name="status"
                                        value={data.status}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("status", e.target.value)}
                                    >
                                        <option>Select Status</option>
                                        <option value="Complete">Complete</option>
                                        <option value="Incomplete">Incomplete</option>
                                    </SelectInput>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div className="mt-4 ">
                                    <Button id="button">Update Status</Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form
                                onSubmit={onSubmit}
                                className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg grid grid-cols-3 gap-12"
                            >

                                <div className="mt-4">
                                    <InputLabel htmlFor="first_name" value="First Name" />
                                    <TextInput
                                        id="first_name"
                                        type="text"
                                        name="firstName"
                                        value={data.firstName}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) => setData("firstName", e.target.value)}
                                    />
                                    <InputError message={errors.firstName} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="middle_name" value="Middle Name" />
                                    <TextInput
                                        id="middle_name"
                                        type="text"
                                        name="middleName"
                                        value={data.middleName}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("middleName", e.target.value)}
                                    />
                                    <InputError message={errors.middleName} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="last_name" value="Last Name" />
                                    <TextInput
                                        id="last_name"
                                        type="text"
                                        name="lastName"
                                        value={data.lastName}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("lastName", e.target.value)}
                                    />
                                    <InputError message={errors.lastName} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="sex" value="Sex" />
                                    <SelectInput
                                        id="sex"
                                        type="text"
                                        name="sex"
                                        value={data.sex}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("sex", e.target.value)}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </SelectInput>
                                    <InputError message={errors.sex} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="age" value="Age" />
                                    <TextInput
                                        id="age"
                                        type="number"
                                        name="age"
                                        value={data.age}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("age", e.target.value)}
                                    />
                                    <InputError message={errors.age} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="birthDate" value="Birth Date" />
                                    <TextInput
                                        id="birthDate"
                                        type="date"
                                        name="birthDate"
                                        value={format(data.birthDate, "yyyy-MM-dd")}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("birthDate", e.target.value)}
                                    />
                                    <InputError message={errors.birthDate} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="birthPlace" value="Birth Place" />
                                    <TextInput
                                        id="birthPlace"
                                        type="text"
                                        name="birthPlace"
                                        value={data.birthPlace}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("birthPlace", e.target.value)}
                                    />
                                    <InputError message={errors.birthPlace} className="mt-2" />
                                </div>



                                <div className="mt-4">
                                    <InputLabel htmlFor="religion" value="Religion" />
                                    <TextInput
                                        id="religion"
                                        type="text"
                                        name="religion"
                                        value={data.religion}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("religion", e.target.value)}
                                    />
                                    <InputError message={errors.religion} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="address" value="Address" />
                                    <TextInput
                                        id="address"
                                        type="text"
                                        name="address"
                                        value={data.address}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("address", e.target.value)}
                                    />
                                    <InputError message={errors.address} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="barangay" value="Barangay" />
                                    <TextInput
                                        id="barangay"
                                        type="text"
                                        name="barangay"
                                        value={data.barangay}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("barangay", e.target.value)}
                                    />
                                    <InputError message={errors.barangay} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="zip_code" value="Zip Code" />
                                    <TextInput
                                        id="zip_code"
                                        type="text"
                                        name="zipCode"
                                        value={data.zipCode}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("zipCode", e.target.value)}
                                    />
                                    <InputError message={errors.zipCode} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="contact_no" value="Contact No" />
                                    <TextInput
                                        id="contact_no"
                                        type="text"
                                        name="contactNo"
                                        value={data.contactNo}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("contactNo", e.target.value)}
                                    />
                                    <InputError message={errors.contactNo} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="nationality" value="Nationality" />
                                    <TextInput
                                        id="nationality"
                                        type="text"
                                        name="nationality"
                                        value={data.nationality}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("nationality", e.target.value)}
                                    />
                                    <InputError message={errors.nationality} className="mt-2" />
                                </div>



                                <div className="mt-4">
                                    <InputLabel htmlFor="civil_status" value="Civil Status" />
                                    <TextInput
                                        id="civil_status"
                                        type="text"
                                        name="civilStatus"
                                        value={data.civilStatus}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("civilStatus", e.target.value)}
                                    />
                                    <InputError message={errors.nationality} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="ethnic_background" value="Ethnic Background" />
                                    <TextInput
                                        id="ethnic_background"
                                        type="text"
                                        name="ethnicBackground"
                                        value={data.ethnicBackground}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("ethnicBackground", e.target.value)}
                                    />
                                    <InputError message={errors.ethnicBackground} className="mt-2" />
                                </div>

                                <div className='col-span-3'>
                                    <hr></hr>-=*{props.applicant.applicantType}*=-
                                </div>
                                {props.applicant.applicantType === "Freshmen" && (
                                    <div className="col-span-3 grid grid-cols-3 gap-12">                                      
                                        <div className="mt-4">
                                            <InputLabel htmlFor="lrn" value="LRN no." />
                                            <TextInput
                                                id="lrn"
                                                type="text"
                                                name="lrn"
                                                value={data.lrn}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("lrn", e.target.value)}
                                            />
                                            <InputError message={errors.lrn} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="strand" value="Strand" />
                                            <TextInput
                                                id="strand"
                                                type="text"
                                                name="strand"
                                                value={data.strand}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("strand", e.target.value)}
                                            />
                                            <InputError message={errors.strand} className="mt-2" />
                                        </div>

                                        <div className='mt-4'>
                                            <br></br>
                                        </div>

                                        <div className="mt-4  col-span-2">
                                            <InputLabel htmlFor="junior_highschool" value="Junior High School" />
                                            <TextInput
                                                id="junior_highschool"
                                                type="text"
                                                name="juniorHighschool"
                                                value={data.juniorHighschool}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("juniorHighschool", e.target.value)}
                                            />
                                            <InputError message={errors.juniorHighschool} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="junior_highschool_year" value="Junior High School Year Grudated" />
                                            <TextInput
                                                id="junior_highschool_year"
                                                type="text"
                                                name="juniorHighschoolYear"
                                                value={data.juniorHighschoolYear}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("juniorHighschoolYear", e.target.value)}
                                            />
                                            <InputError message={errors.juniorHighschoolYear} className="mt-2" />
                                        </div>

                                        <div className="mt-4 col-span-2">
                                            <InputLabel htmlFor="senior_highschool" value="Senior High School" />
                                            <TextInput
                                                id="senior_highschool"
                                                type="text"
                                                name="seniorHighschool"
                                                value={data.seniorHighschool}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("seniorHighschool", e.target.value)}
                                            />
                                            <InputError message={errors.seniorHighschool} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="senior_highschool_year" value="Senior High School Year Graduated" />
                                            <TextInput
                                                id="senior_highschool_year"
                                                type="text"
                                                name="seniorHighschoolYear"
                                                value={data.seniorHighschoolYear}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("seniorHighschoolYear", e.target.value)}
                                            />
                                            <InputError message={errors.seniorHighschoolYear} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="g11gwa1" value="Grade Eleven (G11) First Semester GWA" />
                                            <TextInput
                                                id="g11gwa1"
                                                type="number"
                                                name="g11gwa1"
                                                value={data.g11gwa1}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("g11gwa1", e.target.value)}
                                                step=".01"
                                            />
                                            <InputError message={errors.g11gwa1} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="g11gwa2" value="Grade Eleven (G11) Second Semester GWA" />
                                            <TextInput
                                                id="g11gwa2"
                                                type="number"
                                                name="g11gwa2"
                                                value={data.g11gwa2}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("g11gwa2", e.target.value)}
                                                step=".01"
                                            />
                                            <InputError message={errors.g11gwa2} className="mt-2" />
                                        </div>

                                        <div className='mt-4'>
                                            <br></br>
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="g12gwa1" value="Grade Twelve (G12) First Semester GWA" />
                                            <TextInput
                                                id="g12gwa1"
                                                type="number"
                                                name="g12gwa1"
                                                value={data.g12gwa1}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("g12gwa1", e.target.value)}
                                                step=".01"
                                            />
                                            <InputError message={errors.g12gwa1} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="g12gwa2" value="Grade Twelve (G12) 2nd Semester GWA" />
                                            <TextInput
                                                id="g12gwa2"
                                                type="number"
                                                name="g12gwa2"
                                                value={data.g12gwa2}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("g12gwa2", e.target.value)}
                                                step=".01"
                                            />
                                            <InputError message={errors.g12gwa2} className="mt-2" />
                                        </div>

                                        <div className='mt-4'>
                                            <br></br>
                                        </div>
                                    </div>
                                )}

                                {props.applicant.applicantType === "ALS" && (
                                 
                                    <div className="col-span-3 grid grid-cols-3 gap-12">     
                                                                                                                
                                        <div className="mt-4">
                                            <InputLabel htmlFor="alslearningcenter" value="ALS Learning Center" />
                                            <TextInput
                                                id="alslearningcenter"
                                                type="text"
                                                name="alsLearningCenter"
                                                value={data.alsLearningCenter}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("alsLearningCenter", e.target.value)}
                                            />
                                            <InputError message={errors.alsLearningCenter} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="alsLearningYear" value="ALS Learning Center Year Graduated" />
                                            <TextInput
                                                id="alsLearningYear"
                                                type="text"
                                                name="alsLearningYear"
                                                value={data.alsLearningYear}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("alsLearningYear", e.target.value)}
                                            />
                                            <InputError message={errors.alsLearningYear} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="alsTestingDate" value="ALS Accreditation Equivalent Testing Date" />
                                            <TextInput
                                                id="alsTestingDate"
                                                type="text"
                                                name="alsTestingDate"
                                                value={data.alsTestingDate}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("alsTestingDate", e.target.value)}
                                            />
                                            <InputError message={errors.alsTestingDate} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="alsRating" value="ALS Accreditation Equivalent Rating" />
                                            <TextInput
                                                id="alsRating"
                                                type="text"
                                                name="alsRating"
                                                value={data.alsRating}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("alsRating", e.target.value)}
                                            />
                                            <InputError message={errors.alsRating} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="alsRemarks" value="ALS Accreditation Equivalent Remarks" />
                                            <TextInput
                                                id="alsRemarks"
                                                type="text"
                                                name="alsRemarks"
                                                value={data.alsRemarks}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("alsRemarks", e.target.value)}
                                            />
                                            <InputError message={errors.alsRemarks} className="mt-2" />
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <InputLabel htmlFor="first_course" value="First Choice" />

                                    <SelectInput
                                        id="first_course"
                                        name="firstCourse"
                                        value={data.firstCourse}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("firstCourse", e.target.value)}
                                    >
                                        {props.courses.map((course) => (
                                            <option key={course.id} value={course.course}>{course.course}</option>
                                        ))}
                                    </SelectInput>
                                    <InputError message={errors.firstCourse} className="mt-2" />

                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="second_course" value="Second Choice" />
                                    <SelectInput
                                        id="second_course"
                                        type="text"
                                        name="secondCourse"
                                        value={data.secondCourse}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("secondCourse", e.target.value)}
                                    >
                                        {props.courses.map((course) => (
                                            <option key={course.id} value={course.course}>{course.course}</option>
                                        ))}
                                    </SelectInput>
                                    <InputError message={errors.secondCourse} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="third_course" value="Third Choice" />
                                    <SelectInput
                                        id="third_course"
                                        type="text"
                                        name="thirdCourse"
                                        value={data.thirdCourse}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("thirdCourse", e.target.value)}
                                    >
                                        {props.courses.map((course) => (
                                            <option key={course.id} value={course.course}>{course.course}</option>
                                        ))}
                                    </SelectInput>
                                    <InputError message={errors.thirdCourse} className="mt-2" />
                                </div>

                                <div className="mt-4 col-span-3">
                                    <hr></hr>
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="parent_name" value="Name of Parent" />
                                    <TextInput
                                        id="parent_name"
                                        type="text"
                                        name="parentName"
                                        value={data.parentName}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("parentName", e.target.value)}
                                    />
                                    <InputError message={errors.parentName} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="parent_contact_no" value="Parent Contact No" />
                                    <TextInput
                                        id="parent_contact_no"
                                        type="text"
                                        name="parentContactNo"
                                        value={data.parentContactNo}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("parentContactNo", e.target.value)}
                                    />
                                    <InputError message={errors.parentContactNo} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="parent_comelec_no" value="Parent Comelec No" />
                                    <TextInput
                                        id="parent_comelec_no"
                                        type="text"
                                        name="parentComelecNo"
                                        value={data.parentComelecNo}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("parentComelecNo", e.target.value)}
                                    />
                                    <InputError message={errors.parentComelecNo} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="student_comelec_no" value="Student Comelec No" />
                                    <TextInput
                                        id="student_comelec_no"
                                        type="text"
                                        name="studentComelecNo"
                                        value={data.studentComelecNo}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData("studentComelecNo", e.target.value)}
                                    />
                                    <InputError message={errors.studentComelecNo} className="mt-2" />

                                    <div className="mt-4">
                                        <InputLabel htmlFor="button" value="*" />
                                        <button id="button" className="bg-emerald-500 py-1 px-3 w-full text-white rounded shadow transition-all hover:bg-emerald-600">
                                            Update Student
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
