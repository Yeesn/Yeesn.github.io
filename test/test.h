#ifndef __CAR_H__
#define __CAR_H__
#include<iostream>
using namespace std;
#define IN_CPP 1
template <class T>
class car
{
public:
    car(T a);
    void print();
public:
    T data;
};
#if IN_CPP
#else
template <class T>
car<T>::car(T a)
{
    data = a;
}
template <class T>
void car<T>::print()
{
    cout << "data = " << data << endl;
}
#endif
#endif // __CAR_H__