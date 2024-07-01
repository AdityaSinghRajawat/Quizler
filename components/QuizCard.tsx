import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Edit, Trash } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { IQuiz } from '@/models/Quiz';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface QuizCardProps {
    quiz: IQuiz
}

const QuizCard = ({ quiz }: QuizCardProps) => {

    const router = useRouter();
    const pathName = usePathname();
    const { data: session } = useSession();

    const handleEdit = (quiz: IQuiz) => {
        router.push(`/edit-quiz?id=${quiz._id}`);
    }

    const handleDelete = async (quiz: IQuiz) => {
        const hasConfirmed = confirm("Are you sure you want to delete this prompt?");

        if (hasConfirmed) {
            try {
                await axios.delete(`/api/quiz/${String(quiz._id).toString()}`);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handlePlay = (quiz: IQuiz) => {
        router.push(`/play-quiz?id=${quiz._id}`);
    }

    const handleCreatorClick = () => {

        if (String(quiz.creator?._id) === session?.user.id) return router.push("/profile");

        router.push(`/profile/${quiz.creator?._id}?name=${encodeURIComponent(('name' in quiz.creator) ? quiz.creator.name : 'Unknown')}&image=${encodeURIComponent(('image' in quiz.creator) ? quiz.creator.image : '')}`);
    };

    return (
        <Card className="bg-background shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
                <div>
                    <CardTitle className='mb-3'>{quiz.title}</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                    <p className="text-sm font-semibold text-primary mt-2 cursor-pointer" onClick={handleCreatorClick}>
                        Created by: {('name' in quiz.creator) ? quiz.creator.name : 'Unknown'}
                    </p>
                </div>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
                <Button onClick={() => handlePlay(quiz)}>Play Now</Button>
                {session?.user?.id === String(quiz.creator?._id) && pathName === '/profile' && (
                    <div className="flex space-x-2">
                        <Button variant="ghost" className="p-2" aria-label="Edit" onClick={() => handleEdit(quiz)}>
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" className="p-2" aria-label="Delete" onClick={() => handleDelete(quiz)}>
                            <Trash className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default QuizCard;
