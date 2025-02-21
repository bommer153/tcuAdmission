<?php

namespace App\Exports;

use App\Models\applicant;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromArray;


class applicantFormat implements FromArray
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function array(): array
    {
        return[
                'firstname',
                'middlename',
                'lastname',
                'email',
                'sex',
                'age',
                'birthday',               
                'birthplace',               
                'religion',               
                'address',               
                'barangay',               
                'zipcode',               
                'contactno',               
                "Filipino",               
                'civilstatus',                               
                'ethnicbackground', 
                'juniorhighschool',               
                'juniorhighschoolyear',               
                'seniorhighschool',               
                'seniorhighschoolyear',   
                'lrn',   
                'strand',   
                'g11gwa1',   
                'g11gwa2',   
                'g12gwa1',   
                'g12gwa2',                     
                'firstcourse',   
                'secondcourse',   
                'thirdcourse',   
                'nameparent',   
                'parentcontactno',   
                'parentcomelecno',   
                'studentcomelecno',   
                'image',   
                'confirm1',   
                'confirm2',   
                'confirm3'
            ];               
       
    }
}
