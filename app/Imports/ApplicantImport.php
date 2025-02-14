<?php

namespace App\Imports;

use App\Models\applicant;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Collection;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class ApplicantImport implements ToCollection, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function collection(Collection $rows)
    {
       
        foreach ($rows as $row) {
            //dd($row);
            set_time_limit(0);
            $applicant = applicant::where('email', $row['email'])->first();
            
            $excelDate = $row['birthdate'];

            // Check if the year is in the range 0001 to 0009 (e.g., 0001 to 0009)
            if (preg_match('/(\d{1,2})\/(\d{1,2})\/000(\d{1})/', $excelDate, $matches)) {
                // For years between 0001 and 0009, adjust by adding 2000
                $correctedDate = $matches[1] . '/' . $matches[2] . '/20' . $matches[3];
                $phpDate = \Carbon\Carbon::createFromFormat('m/d/Y', $correctedDate);
                $formattedDate = $phpDate->format('m/d/Y');
            }
            // Check if the year is in the range 0010 to 0999 (e.g., 0010 to 0999)
            elseif (preg_match('/(\d{1,2})\/(\d{1,2})\/00(\d{2})/', $excelDate, $matches)) {
                // For years between 0010 and 0999, adjust by adding 2000
                $correctedDate = $matches[1] . '/' . $matches[2] . '/20' . $matches[3];
                $phpDate = \Carbon\Carbon::createFromFormat('m/d/Y', $correctedDate);
                $formattedDate = $phpDate->format('m/d/Y');
            }
            // Check if the year has a leading zero (like '0207', '0105') and should be in the 2000s
            elseif (preg_match('/(\d{1,2})\/(\d{1,2})\/0(\d{2})/', $excelDate, $matches)) {
                // Adjust for years like 0207 -> 2027, 0105 -> 2015
                $correctedDate = $matches[1] . '/' . $matches[2] . '/20' . $matches[3];
                $phpDate = \Carbon\Carbon::createFromFormat('m/d/Y', $correctedDate);
                $formattedDate = $phpDate->format('m/d/Y');
            } else {
                // If it's a valid date format, just convert it normally
                $phpDate = Date::excelToDateTimeObject($excelDate);
                $formattedDate = $phpDate->format('m/d/Y');
               
               
            }

            // Convert the corrected date string to DateTime using Carbon
          

            // Now you can format the corrected date as needed
        

            // Continue with your import logic, using the formatted date
            // Example: 'dob' => $formattedDate

           

            if($applicant){
                $applicant->update([
                    'first_name' => $row['firstname'],
                    'middle_name' => $row['middlename'],
                    'last_name' => $row['lastname'],
                    'email' => $row['email'],
                    'sex' => $row['sex'],
                    'age' => $row['age'],
                    'dob' => $formattedDate,               
                    'birth_place' => $row['birthplace'],               
                    'religion' => $row['religion'],               
                    'address' => $row['address'],               
                    'barangay' => $row['barangay'],               
                    'zip_code' => $row['zipcode'],               
                    'contact_no' => $row['contactno'],               
                    'nationality' => "Filipino",               
                    'civil_status' => $row['civilstatus'],                               
                    'ethnic_background' => $row['ethnicbackground'], 

                    'junior_high_school' => $row['juniorhighschool'],               
                    'junior_high_school_year_graduated' => $row['juniorhighschoolyear'],               
                    'senior_high_school' => $row['seniorhighschool'],               
                    'senior_high_school_year_graduated' => $row['seniorhighschoolyear'],   
                    'lrn' => $row['lrn'],   
                    'strand' => $row['strand'],   
                    'g11_gwa1' => $row['g11gwa1'],   
                    'g11_gwa2' => $row['g11gwa2'],   
                    'g12_gwa1' => $row['g12gwa1'],   
                    'g12_gwa2' => $row['g12gwa2'],  

                    'applicantType' => "Freshmen",   
                    'first_course' => $row['firstcourse'],   
                    'second_course' => $row['secondcourse'],   
                    'third_course' => $row['thirdcourse'],   
                    'name_of_parent' => $row['nameparent'],   
                    'parent_contact_no' => $row['parentcontactno'],   
                    'parent_comelec_no' => $row['parentcomelecno'],   
                    'student_comelec_no' => $row['studentcomelecno'],   
                    'image_path' => $row['image'],   
                    'confirm_1' => $row['confirm1'],   
                    'confirm_2' => $row['confirm2'],   
                    'confirm_3' => $row['confirm3'],     
                    
                    'created_by' => auth::id(),
                    'created_at' => now(),
                ]);
            }else{
                applicant::create([
                    'first_name' => $row['firstname'],
                    'middle_name' => $row['middlename'],
                    'last_name' => $row['lastname'],
                    'email' => $row['email'],
                    'sex' => $row['sex'],
                    'age' => $row['age'],
                    'dob' => $formattedDate,               
                    'birth_place' => $row['birthplace'],               
                    'religion' => $row['religion'],               
                    'address' => $row['address'],               
                    'barangay' => $row['barangay'],               
                    'zip_code' => $row['zipcode'],               
                    'contact_no' => $row['contactno'],               
                    'nationality' => "Filipino",               
                    'civil_status' => $row['civilstatus'],                               
                    'ethnic_background' => $row['ethnicbackground'], 

                    'junior_high_school' => $row['juniorhighschool'],               
                    'junior_high_school_year_graduated' => $row['juniorhighschoolyear'],               
                    'senior_high_school' => $row['seniorhighschool'],               
                    'senior_high_school_year_graduated' => $row['seniorhighschoolyear'],   
                    'lrn' => $row['lrn'],   
                    'strand' => $row['strand'],   
                    'g11_gwa1' => $row['g11gwa1'],   
                    'g11_gwa2' => $row['g11gwa2'],   
                    'g12_gwa1' => $row['g12gwa1'],   
                    'g12_gwa2' => $row['g12gwa2'],  

                    'applicantType' => "Freshmen",   
                    'first_course' => $row['firstcourse'],   
                    'second_course' => $row['secondcourse'],   
                    'third_course' => $row['thirdcourse'],   
                    'name_of_parent' => $row['nameparent'],   
                    'parent_contact_no' => $row['parentcontactno'],   
                    'parent_comelec_no' => $row['parentcomelecno'],   
                    'student_comelec_no' => $row['studentcomelecno'],   
                    'image_path' => $row['image'],   
                    'confirm_1' => $row['confirm1'],   
                    'confirm_2' => $row['confirm2'],   
                    'confirm_3' => $row['confirm3'],     
                    
                    'created_by' => auth::id(),
                    'created_at' => now(),
                ]);
            }
           
        }
    }

    public function chunkSize(): int
    {
        return 5000; 
    }
}
