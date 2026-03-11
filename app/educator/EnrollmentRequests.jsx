'use client'

import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AppContext } from '@/app/context/AppContext'
import { toast } from 'react-toastify'
import Loading from '@/components/student/Loading'

const EnrollmentRequests = () => {
  const { getToken, isEducator } = useContext(AppContext)
  const [requests, setRequests] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)

  const fetchRequests = async () => {
    try {
      const token = await getToken()

      const { data } = await axios.get('/api/educator/enrollment-requests', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        const list = data.enrollmentRequests.reverse()
        setRequests(list)
        if (selectedRequest) {
          const updated = list.find((r) => r.id === selectedRequest.id)
          setSelectedRequest(updated || null)
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleAction = async (requestId, action) => {
    try {
      const token = await getToken()
      const url =
        action === 'approve'
          ? '/api/educator/enrollment-requests/approve'
          : '/api/educator/enrollment-requests/decline'

      const { data } = await axios.post(
        url,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        fetchRequests()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchRequests()
    }
  }, [isEducator])

  return requests ? (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20 ">
        <div className="w-full px-4 py-3 border-b border-gray-500/20 text-left">
          <h2 className="text-lg font-semibold text-gray-800">Enrollment Requests</h2>
          <p className="text-sm text-gray-500">
            Review requests from students and approve or decline access to your courses.
          </p>
        </div>
        <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
              <th className="px-4 py-3 font-semibold">Student</th>
              <th className="px-4 py-3 font-semibold hidden md:table-cell">Course</th>
              <th className="px-4 py-3 font-semibold hidden lg:table-cell">Details</th>
              <th className="px-4 py-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-500">
            {requests.map((req, index) => (
              <tr
                key={req.id}
                className={`border-b border-gray-500/20 align-top cursor-pointer ${selectedRequest?.id === req.id ? 'bg-indigo-50/60' : ''}`}
                onClick={() => setSelectedRequest(req)}
              >
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  {index + 1}
                </td>
                <td className="md:px-4 px-2 py-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={req.student.imageUrl}
                      alt=""
                      className="w-9 h-9 rounded-full"
                    />
                    <div className="space-y-0.5">
                      <p className="font-medium text-gray-800">
                        {req.studentName || req.student.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Age: {req.age ?? 'N/A'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <p className="font-medium text-gray-800 truncate">
                    {req.courseTitle}
                  </p>
                  <p className="text-xs text-gray-500">
                    Requested on {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold">Education:</span>{' '}
                    {req.education || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-700 mt-1">
                    <span className="font-semibold">Reason:</span>{' '}
                    {req.reason || 'N/A'}
                  </p>
                  {req.additionalInfo && (
                    <p className="text-xs text-gray-700 mt-1">
                      <span className="font-semibold">Additional Info:</span>{' '}
                      {req.additionalInfo}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      onClick={() => handleAction(req.id, 'approve')}
                      className="px-3 py-1 rounded bg-green-600 text-white text-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'decline')}
                      className="px-3 py-1 rounded bg-red-600 text-white text-xs"
                    >
                      Decline
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No pending enrollment requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {selectedRequest && (
          <div className="w-full px-4 pb-6 border-t border-gray-500/20 bg-gray-50/60">
            <h3 className="text-md font-semibold text-gray-800 mt-4 mb-2">
              Request Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="space-y-1">
                <p>
                  <span className="font-semibold">Student Name: </span>
                  {selectedRequest.studentName || selectedRequest.student?.name}
                </p>
                <p>
                  <span className="font-semibold">Age: </span>
                  {selectedRequest.age ?? 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Course: </span>
                  {selectedRequest.courseTitle}
                </p>
                <p>
                  <span className="font-semibold">Requested On: </span>
                  {new Date(selectedRequest.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Educational Background:</span>
                  <br />
                  {selectedRequest.education || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Reason for Enrolling:</span>
                  <br />
                  {selectedRequest.reason || 'N/A'}
                </p>
                {selectedRequest.additionalInfo && (
                  <p>
                    <span className="font-semibold">Additional Info:</span>
                    <br />
                    {selectedRequest.additionalInfo}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => handleAction(selectedRequest.id, 'approve')}
                className="px-4 py-2 rounded bg-green-600 text-white text-sm"
              >
                Approve & Give Access
              </button>
              <button
                onClick={() => handleAction(selectedRequest.id, 'decline')}
                className="px-4 py-2 rounded bg-red-600 text-white text-sm"
              >
                Decline Request
              </button>
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded border border-gray-300 text-sm text-gray-700 bg-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default EnrollmentRequests

