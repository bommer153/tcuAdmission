<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barangay extends Model
{
    use HasFactory;

    public function myApplicants()
    {
        return $this->hasMany(applicant::class, 'barangay','barangay');
    }
    
    public function myApplicantsWithPermit()
    {
        return $this->hasMany(applicant::class, 'barangay','barangay')->whereNotNull('printed_by');
    }

  
}
