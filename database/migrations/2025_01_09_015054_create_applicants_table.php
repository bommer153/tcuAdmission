<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('applicants', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('middle_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('sex');
            $table->string('age');
            $table->string('dob');
            $table->string('birth_place');
            $table->string('religion');
            $table->string('address');
            $table->string('barangay');
            $table->string('zip_code');
            $table->string('contact_no');
            $table->string('nationality');
            $table->string('civil_status');

            $table->string('ethnic_background')->nullable();
            $table->string('junior_high_school')->nullable();
            $table->string('junior_high_school_year_graduated')->nullable();
            $table->string('senior_high_school')->nullable();
            $table->string('senior_high_school_year_graduated')->nullable();   
            $table->string('lrn')->nullable();
            $table->string('strand')->nullable();
            $table->string('g11_gwa1')->nullable();
            $table->string('g11_gwa2')->nullable();
            $table->string('g12_gwa1')->nullable();
            $table->string('g12_gwa2')->nullable();

            $table->string('als_learning_center')->nullable();
            $table->string('als_learning_center_year_graduated')->nullable();
            $table->string('als_accreditation_equivalent_testing_date')->nullable();
            $table->string('als_accreditation_equivalent_rating')->nullable();
            $table->string('als_accreditation_equivalent_remarks')->nullable();

            $table->text( 'athlete')->nullable();

            $table->string('applicantType');
            $table->string('first_course');
            $table->string('second_course');
            $table->string('third_course');
            $table->string('name_of_parent');
            $table->string('parent_contact_no');
            $table->string('parent_comelec_no');
            $table->string('student_comelec_no');
            $table->string('image_path')->nullable();
            $table->string('confirm_1');
            $table->string('confirm_2');
            $table->string('confirm_3');
            $table->string('remarks')->nullable();
            $table->string('exam_date')->nullable();
            $table->string('exam_time')->nullable();
            $table->string('exam_room_no')->nullable();
            $table->string('exam_seat_no')->nullable();
            $table->string('exam_score')->default('0');
            $table->foreignId('created_by')->contrained('users');
            $table->foreignId('validated_by')->contrained('users')->nullable();
            $table->foreignId('printed_by')->contrained('users')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('applicants');
    }
};
