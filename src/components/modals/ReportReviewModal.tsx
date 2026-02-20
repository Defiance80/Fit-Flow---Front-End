"use client"
import React from 'react'
import {
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogHeader,
    DialogFooter,
} from "@/components/ui/dialog";
import { Dialog } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { ReviewType } from '@/types';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { BiSolidStar } from 'react-icons/bi';

interface ReportReviewModalProps {
    reportModalOpen: boolean;
    setReportModalOpen: (open: boolean) => void;
    selectedPost: ReviewType | null;
    reportReason: string;
    setReportReason: (reason: string) => void;
    handleSendReport: () => void;
}
const ReportReviewModal = ({ reportModalOpen, setReportModalOpen, selectedPost, reportReason, setReportReason, handleSendReport }: ReportReviewModalProps) => {
    return (
        <div>
            {/* Report Modal */}
            <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden max-w-[95vw] mx-auto">
                    <DialogHeader className="px-3 sm:px-6 mb-0 pt-3 sm:pt-6">
                        <DialogTitle className="text-base sm:text-lg font-semibold">
                            Report This Review
                        </DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                            If you notice something inappropriate or misleading in a review,
                            you can report it.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPost && (
                        <div className="mx-3 sm:mx-6 p-2 sm:p-4 sectionBg rounded-lg">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-400 text-white">
                                    <AvatarFallback>
                                        {selectedPost.author.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-medium text-xs sm:text-base">
                                            {selectedPost.author.name}
                                        </h3>
                                        <div className="flex items-center">
                                            <span className="mr-1">
                                                <BiSolidStar className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                                            </span>
                                            <span className="text-xs sm:text-sm font-medium">
                                                4.7
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">Jan 15, 2025</p>
                                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm line-clamp-3 sm:line-clamp-none">
                                        {selectedPost.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="px-3 sm:px-6 pb-3 sm:pb-6 pt-2 sm:pt-0">
                        <h3 className="text-xs sm:text-base font-medium mb-1 sm:mb-2">
                            Report
                        </h3>
                        <Textarea
                            placeholder="Enter the reason for reporting..."
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            className="min-h-[100px] sm:min-h-[150px] resize-none sectionBg text-xs sm:text-sm"
                        />

                        <DialogFooter className="mt-3 sm:mt-6 flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setReportModalOpen(false)}
                                className="text-xs px-3 sm:px-4 h-7 sm:h-9"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                onClick={handleSendReport}
                                className="bg-black hover:bg-gray-800 text-xs px-3 sm:px-4 h-7 sm:h-9"
                            >
                                Send
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default ReportReviewModal
