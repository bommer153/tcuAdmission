<?php

namespace App\Imports;

use App\Models\applicant;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Collection;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class applicantAls implements ToCollection, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function collection(Collection $rows)
    {
       
        foreach ($rows as $row) {
            //dd($rows);
            $applicant = applicant::where('email', $row['email'])->first();
            
            $phpDate = Date::excelToDateTimeObject($row['birthdate'])->format('m/d/Y'); 

            if($applicant){
                $applicant->update([
                    'first_name' => $row['firstname'],
                    'middle_name' => $row['middlename'],
                    'last_name' => $row['lastname'],
                    'email' => $row['email'],
                    'sex' => $row['sex'],
                    'age' => $row['age'],
                    'dob' => $phpDate,               
                    'birth_place' => $row['birthplace'],               
                    'religion' => $row['religion'],               
                    'address' => $row['address'],               
                    'barangay' => $row['barangay'],               
                    'zip_code' => $row['zipcode'],               
                    'contact_no' => $row['contactno'],               
                    'nationality' => "Filipino",               
                    'civil_status' => $row['civilstatus'],                               
                    'ethnic_background' => $row['ethnicbackground'], 

                    'als_learning_center' => $row['alslearningcenter'],               
                    'als_learning_center_year_graduated' => $row['alslearningcenteryear'],               
                    'als_accreditation_equivalent_testing_date' => $row['alstestingdate'],               
                    'als_accreditation_equivalent_rating' => $row['alsrating'],   
                    'als_accreditation_equivalent_remarks' => $row['alsremarks'],   
                   
                    'applicantType' => "ALS",   
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
                    'dob' => $phpDate,               
                    'birth_place' => $row['birthplace'],               
                    'religion' => $row['religion'],               
                    'address' => $row['address'],               
                    'barangay' => $row['barangay'],               
                    'zip_code' => $row['zipcode'],               
                    'contact_no' => $row['contactno'],               
                    'nationality' => "Filipino",               
                    'civil_status' => $row['civilstatus'],                               
                    'ethnic_background' => $row['ethnicbackground'], 

                    'als_learning_center' => $row['alslearningcenter'],               
                    'als_learning_center_year_graduated' => $row['alslearningcenteryear'],               
                    'als_accreditation_equivalent_testing_date' => $row['alstestingdate'],               
                    'als_accreditation_equivalent_rating' => $row['alsrating'],   
                    'als_accreditation_equivalent_remarks' => $row['alsremarks'],   
                   
                    'applicantType' => "ALS",   
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
}
