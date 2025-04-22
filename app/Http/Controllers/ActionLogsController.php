<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActionLogs;

class ActionLogsController extends Controller
{
    //

    public function index()
    {
        $logs = ActionLogs::with('user_info')
                ->latest()
                ->get();

        return inertia('ActionLogs', [
            'logs' => $logs,
        ]);
    }
    
}
