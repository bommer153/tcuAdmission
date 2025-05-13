import TextInput from '@/Components/TextInput';
import { ACTION_CLASS_MAP, USER_STATUS_CLASS_MAP, USER_STATUS_TEXT_MAP } from '@/constant';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useState } from 'react';

export default function ActionLogs({ auth, logs }) {




    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">LOGS</h2>}
        >
            <Head title="Logs" />



            <div className="py-12">

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className='text-white'>COUNT : {logs.length}</div>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">


                            <div className="overflow-x-auto">
                                <table className="table-auto w-full border text-gray-800">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-2 border">Timestamp</th>
                                            <th className="p-2 border">User</th>
                                            <th className="p-2 border">Action</th>
                                            <th className="p-2 border w-[20px] text-[10px]">Applicant ID</th>
                                            <th className="p-2 border">Changed Fields</th>
                                            <th className="p-2 border">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map((log) => {
                                            let meta = {};
                                            try {
                                                meta = JSON.parse(log.metadata);
                                            } catch (e) {
                                                console.error("Invalid metadata JSON:", log.metadata);
                                            }

                                            return (
                                                <tr key={log.id} className="text-sm text-gray-400">
                                                    <td className="p-0.5 border-b border-gray-300">{new Date(log.created_at).toLocaleString()}</td>
                                                    <td className="p-0.5 border-b border-gray-300 text-[12px]">
                                                        {log.user_info?.name || 'System'}
                                                        <span className={"text-[9px] rounded p-1 ml-1" + USER_STATUS_CLASS_MAP[log.user_info.role]}>{USER_STATUS_TEXT_MAP[log.user_info.role]}</span>
                                                    </td>
                                                    <td className="p-0.5 border-b border-gray-300"> <span className={"p-1 rounded text-[11px]" + ACTION_CLASS_MAP[log.action]}>{log.action}</span></td>
                                                    <td className="p-0.5 border-b border-gray-300 w-[20px]">{log.target_id}</td>
                                                    <td className="p-0.5 border-b border-gray-300 w-[350px] text-[12px]">
                                                        {meta.changed_fields?.length ? (
                                                            <ul className="list-disc list-inside">
                                                                {meta.changed_fields.map((field, i) => (
                                                                    <li key={i}>
                                                                        <strong>{field}</strong>:&nbsp;
                                                                        <span className="text-red-500 line-through">{meta.previous_values?.[field]}</span> ➜{' '}
                                                                        <span className="text-green-600">{meta.new_values?.[field]}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <em>—</em>
                                                        )}
                                                    </td>
                                                    <td className="p-0.5 border-b border-gray-300 w-[350px]">{meta.description || '—'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
